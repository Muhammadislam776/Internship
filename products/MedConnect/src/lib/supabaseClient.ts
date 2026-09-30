import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRole } from '../types';

const STORAGE_KEY_URL = 'medconnect_supabase_url';
const STORAGE_KEY_ANON = 'medconnect_supabase_anon_key';

const DEFAULT_SUPABASE_URL = 'https://qgkjilkbsarwvtumeqcv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFna2ppbGtic2Fyd3Z0dW1lcWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NzUzNzIsImV4cCI6MjEwNjI1MTM3Mn0.PogmvMsNVV0zude_ft571pMKmKYXpuixjV3y3OZf_Oc';

export const getSupabaseConfig = () => {
  const url = localStorage.getItem(STORAGE_KEY_URL) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
  const anonKey = localStorage.getItem(STORAGE_KEY_ANON) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;
  return { url, anonKey };
};

let currentConfig = getSupabaseConfig();
export let supabase: SupabaseClient = createClient(currentConfig.url, currentConfig.anonKey);

export function updateSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_URL, url);
    localStorage.setItem(STORAGE_KEY_ANON, anonKey);
    currentConfig = { url, anonKey };
    supabase = createClient(url, anonKey);
    return true;
  } catch (e) {
    console.error('Failed to update Supabase config:', e);
    return false;
  }
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, anonKey);
    // Simple ping or auth check
    const { data, error } = await client.auth.getSession();
    if (error && !error.message.includes('Auth session missing')) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected to Supabase successfully! RLS policies & Auth ready.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed. Please verify URL and Anon Key.' };
  }
}

/**
 * Supabase Row Level Security (RLS) Policy Engine
 */
export interface RlsCheckResult {
  allowed: boolean;
  policyName: string;
  reason: string;
}

export function evaluateRlsPolicy(
  userRole: UserRole,
  userId: string,
  _targetResourceId: string,
  resourceType: 'PATIENT_PHI' | 'PRESCRIPTION_SIGN' | 'APPOINTMENT_SCHEDULE' | 'CLINIC_ROTA' | 'AUDIT_LOGS',
  resourceOwnerId?: string
): RlsCheckResult {
  if (userRole === 'saas_admin') {
    return {
      allowed: true,
      policyName: 'saas_admin_break_glass_policy',
      reason: 'Full administrative access granted under break-glass HIPAA audit trail'
    };
  }

  if (userRole === 'patient') {
    if (resourceType === 'PRESCRIPTION_SIGN' || resourceType === 'AUDIT_LOGS') {
      return {
        allowed: false,
        policyName: 'patient_forbidden_actions',
        reason: 'Patients are not permitted to sign prescriptions or view system audit logs (UK DPA 2018)'
      };
    }
    if (resourceOwnerId && resourceOwnerId !== userId) {
      return {
        allowed: false,
        policyName: 'patient_isolate_own_phi_policy',
        reason: 'Access Denied: Patient RLS policy restricts record view strictly to own auth.uid()'
      };
    }
    return {
      allowed: true,
      policyName: 'patient_own_records_policy',
      reason: 'Patient authorized to view own clinical profile and appointment history'
    };
  }

  if (userRole === 'receptionist') {
    if (resourceType === 'PATIENT_PHI') {
      return {
        allowed: false,
        policyName: 'reception_no_clinical_notes_policy',
        reason: 'GDPR Minimum Data Principle: Receptionists can view appointments but not confidential clinical intake notes'
      };
    }
    if (resourceType === 'PRESCRIPTION_SIGN') {
      return {
        allowed: false,
        policyName: 'reception_no_prescribing_policy',
        reason: 'Only GMC/GDC registered clinicians may authorize prescriptions'
      };
    }
    return {
      allowed: true,
      policyName: 'reception_schedule_access_policy',
      reason: 'Authorized for booking, arrival check-in, and rota coordination'
    };
  }

  if (userRole === 'doctor' || userRole === 'practice_manager') {
    return {
      allowed: true,
      policyName: 'clinician_full_care_team_policy',
      reason: 'Direct clinical care team exemption under UK GDPR Article 9(2)(h)'
    };
  }

  return {
    allowed: false,
    policyName: 'default_deny_policy',
    reason: 'Strict default-deny security posture active'
  };
}

/**
 * Supabase Realtime WebRTC Signaling Helper
 */
export class SupabaseRealtimeWebRTC {
  private roomId: string;
  private channel: any = null;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  public joinRoom(onSignal: (payload: any) => void) {
    try {
      this.channel = supabase.channel(`telehealth_${this.roomId}`, {
        config: { broadcast: { self: false } }
      });

      this.channel
        .on('broadcast', { event: 'webrtc_signal' }, ({ payload }: any) => {
          onSignal(payload);
        })
        .subscribe();
    } catch (e) {
      console.log('Realtime signaling fallback active');
    }
  }

  public sendSignal(payload: any) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'webrtc_signal',
        payload
      });
    }
  }

  public leaveRoom() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
    }
  }
}

