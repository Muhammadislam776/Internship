import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { GmbBookingWidget } from '../gmb/GmbBookingWidget';
import { SaaSSubscriptionSales } from '../gmb/SaaSSubscriptionSales';
import { ComplianceCenter } from '../compliance/ComplianceCenter';
import { SupabaseConfigModal } from '../common/SupabaseConfigModal';
import { AppointmentScheduler } from '../scheduler/AppointmentScheduler';
import { TwilioMessageCenter } from '../twilio/TwilioMessageCenter';
import { StaffRotaTracker } from '../rota/StaffRotaTracker';
import { HelpSupportView } from '../help/HelpSupportView';
import { UserProfileView } from '../profile/UserProfileView';
import { ClinicianAvailabilityView } from '../availability/ClinicianAvailabilityView';
import { AccountSettingsView } from '../settings/AccountSettingsView';
import {
  TrendingUp, ShieldCheck, Building2, Database, Globe,
  Lock, DollarSign, Users, Activity, CheckCircle2,
  AlertCircle, ChevronRight, Server, Zap, RefreshCw, Key
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { auditLogs, appointments, doctors, patients, activeTab, setActiveTab } = useApp();
  const { currentUser } = useAuth();
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Sub-view routing
  if (activeTab === 'compliance') return <ComplianceCenter />;
  if (activeTab === 'scheduler')  return <AppointmentScheduler />;
  if (activeTab === 'twilio')     return <TwilioMessageCenter />;
  if (activeTab === 'rota')       return <StaffRotaTracker />;
  if (activeTab === 'help')       return <HelpSupportView />;
  if (activeTab === 'profile')       return <UserProfileView />;
  if (activeTab === 'availability')  return <ClinicianAvailabilityView />;
  if (activeTab === 'settings')      return <AccountSettingsView />;

  const totalRevenue = '£48,250';
  const activeClinicsCount = 14;
  const totalUsers = doctors.length + patients.length + 18;

  const mockClinics = [
    { name: 'St. James Health Centre', type: 'NHS / Private GP', city: 'London W1', doctors: 4, plan: 'Enterprise', status: 'active', mrr: '£499' },
    { name: 'Mayfair Smiles Dental Care', type: 'Dental Surgery', city: 'London W1K', doctors: 3, plan: 'Professional', status: 'active', mrr: '£299' },
    { name: 'Kensington Physio & Rehab', type: 'Physiotherapy', city: 'London W8', doctors: 2, plan: 'Professional', status: 'active', mrr: '£299' },
    { name: 'Edinburgh City GP Practice', type: 'NHS Partner', city: 'Edinburgh EH1', doctors: 6, plan: 'Enterprise', status: 'active', mrr: '£499' },
    { name: 'Manchester Central Clinic', type: 'Urgent Care', city: 'Manchester M2', doctors: 5, plan: 'Enterprise', status: 'trial', mrr: '£0' }
  ];

  return (
    <div className="space-y-5">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-white text-sm font-bold flex items-center justify-center shrink-0">
            🛡️
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              SaaS Admin Console: {currentUser?.name || 'Alexander Vance'}
            </h1>
            <p className="text-xs text-slate-500">
              ClinicFlow Multi-Tenant Cloud Platform · UK Region (London eu-west-2) · GDPR / HIPAA Tier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Database className="w-3.5 h-3.5" /> Supabase Connection
          </button>
        </div>
      </div>

      {/* ── KPI Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50"><Building2 className="w-4 h-4 text-blue-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tenants</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{activeClinicsCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Active UK clinic subscriptions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50"><DollarSign className="w-4 h-4 text-emerald-600" /></div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold"><TrendingUp className="w-3 h-3" />+18%</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{totalRevenue}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Monthly Recurring Rev (MRR)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-indigo-50"><Users className="w-4 h-4 text-indigo-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Users</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Clinicians & registered patients</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-purple-50"><ShieldCheck className="w-4 h-4 text-purple-600" /></div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase">100%</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{auditLogs.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Audited compliance events</p>
        </div>
      </div>

      {/* ── Subscriptions & Tenant Manager ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Clinic Tenants Table */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Registered Clinic Tenants</h2>
            </div>
            <span className="text-xs font-semibold text-blue-600">5 of {activeClinicsCount} shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase text-slate-400">Clinic Name</th>
                  <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Type</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400">Plan</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400">MRR</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-bold uppercase text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockClinics.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.city} · {c.doctors} clinicians</p>
                    </td>
                    <td className="px-3 py-3 text-slate-600 hidden sm:table-cell">{c.type}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {c.plan}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-semibold text-slate-900">{c.mrr}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {c.status === 'active' ? '● Active' : 'Trial'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Security & Platform Controls */}
        <div className="space-y-4">
          {/* Security Status Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Infrastructure Security
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Database Engine</span>
                <span className="font-bold text-slate-900">Supabase PostgreSQL 15</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Row Level Security</span>
                <span className="font-bold text-emerald-700">Enforced (RLS Active)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">PHI Vault Encryption</span>
                <span className="font-bold text-slate-900">AES-256-CBC</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Twilio SMS Gateway</span>
                <span className="font-bold text-blue-700">Connected</span>
              </div>
            </div>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
            >
              Configure Supabase Keys
            </button>
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Admin Shortcuts</h3>
            <button onClick={() => setActiveTab('compliance')} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors">
              <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Audit & Compliance Logs</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button onClick={() => setActiveTab('scheduler')} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors">
              <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-emerald-600" /> System Appointments</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button onClick={() => setActiveTab('twilio')} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors">
              <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-indigo-600" /> Twilio Gateway Monitor</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Sales & Billing Widget */}
      <SaaSSubscriptionSales />

      <SupabaseConfigModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
    </div>
  );
};
