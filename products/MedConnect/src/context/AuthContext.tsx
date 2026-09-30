import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole, Permission } from '../types';

export const INITIAL_DEMO_ACCOUNTS: AuthUser[] = [
  {
    id: 'doc_1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@stjamesgp.nhs.uk',
    role: 'doctor',
    title: 'Senior GP Partner & Chronic Disease Lead',
    gmcNumber: 'GMC 7489201',
    clinicName: 'St. James Health Centre (London W1)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    is2FAEnabled: true,
    twoFactorMethod: 'nhs_smartcard',
    permissions: [
      'view_all_patient_phi',
      'decrypt_clinical_intake',
      'sign_prescriptions',
      'manage_appointments',
      'manage_rota',
      'view_performance_analytics'
    ],
    lastLoginAt: '2026-09-28T08:00:00Z'
  },
  {
    id: 'pat_1',
    name: 'Oliver Bennett',
    email: 'oliver.bennett@example.co.uk',
    role: 'patient',
    nhsNumber: '485 772 9012',
    clinicName: 'St. James Health Centre (Patient)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    is2FAEnabled: true,
    twoFactorMethod: 'sms_otp',
    permissions: [
      'view_own_phi',
      'request_prescriptions'
    ],
    lastLoginAt: '2026-09-28T09:30:00Z'
  },
  {
    id: 'rec_1',
    name: 'Hannah Collins',
    email: 'hannah.collins@stjamesgp.nhs.uk',
    role: 'receptionist',
    title: 'Lead Practice Receptionist & Care Coordinator',
    clinicName: 'St. James Health Centre Frontdesk',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    is2FAEnabled: true,
    twoFactorMethod: 'authenticator_app',
    permissions: [
      'manage_appointments',
      'manage_rota'
    ],
    lastLoginAt: '2026-09-28T07:45:00Z'
  },
  {
    id: 'mgr_1',
    name: 'Sarah Miller',
    email: 'sarah.miller@stjamesgp.nhs.uk',
    role: 'practice_manager',
    title: 'GP Practice Operations Manager',
    clinicName: 'St. James Health Centre',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    is2FAEnabled: true,
    twoFactorMethod: 'nhs_smartcard',
    permissions: [
      'manage_appointments',
      'manage_rota',
      'view_performance_analytics',
      'view_audit_logs'
    ],
    lastLoginAt: '2026-09-28T08:15:00Z'
  },
  {
    id: 'admin_1',
    name: 'Alexander Vance',
    email: 'alex.vance@medconnect.co.uk',
    role: 'saas_admin',
    title: 'MedConnect SaaS SuperAdmin & DPO',
    clinicName: 'MedConnect Cloud Infrastructure UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    is2FAEnabled: true,
    twoFactorMethod: 'nhs_smartcard',
    permissions: [
      'view_all_patient_phi',
      'decrypt_clinical_intake',
      'sign_prescriptions',
      'manage_appointments',
      'manage_rota',
      'view_performance_analytics',
      'manage_saas_billing',
      'view_audit_logs',
      'execute_gdpr_erasure'
    ],
    lastLoginAt: '2026-09-28T08:30:00Z'
  }
];

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  nhsNumber?: string;
  gmcNumber?: string;
  clinicName?: string;
  title?: string;
  phone?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  registeredUsers: AuthUser[];
  isAuthenticated: boolean;
  loginAs: (role: UserRole, accountId?: string) => void;
  signUp: (data: SignUpData) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  loginWithCredentials: (email: string, password: string, otp?: string) => Promise<{ success: boolean; message?: string; user?: AuthUser }>;
  logout: () => void;
  updateCurrentUser: (updated: Partial<AuthUser>) => void;
  hasPermission: (perm: Permission) => boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  sessionTimeLeftMinutes: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem('medconnect_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DEMO_ACCOUNTS;
      }
    }
    return INITIAL_DEMO_ACCOUNTS;
  });

  // Start with saved user state if available so login persists across sessions
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const savedSession = localStorage.getItem('medconnect_session_user') || sessionStorage.getItem('medconnect_session_user');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (localStorage.getItem('medconnect_session_user') || sessionStorage.getItem('medconnect_session_user')) !== null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [sessionTimeLeftMinutes, setSessionTimeLeftMinutes] = useState<number>(60);

  useEffect(() => {
    localStorage.setItem('medconnect_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Session timeout simulation (NHS 60-min automatic smartcard lock)
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => {
      setSessionTimeLeftMinutes((prev) => (prev > 1 ? prev - 1 : 60));
    }, 60000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const getPermissionsForRole = (role: UserRole): Permission[] => {
    switch (role) {
      case 'saas_admin':
        return [
          'view_all_patient_phi',
          'decrypt_clinical_intake',
          'sign_prescriptions',
          'manage_appointments',
          'manage_rota',
          'view_performance_analytics',
          'manage_saas_billing',
          'view_audit_logs',
          'execute_gdpr_erasure'
        ];
      case 'doctor':
        return [
          'view_all_patient_phi',
          'decrypt_clinical_intake',
          'sign_prescriptions',
          'manage_appointments',
          'manage_rota',
          'view_performance_analytics'
        ];
      case 'practice_manager':
        return [
          'manage_appointments',
          'manage_rota',
          'view_performance_analytics',
          'view_audit_logs'
        ];
      case 'receptionist':
        return [
          'manage_appointments',
          'manage_rota'
        ];
      case 'patient':
      default:
        return [
          'view_own_phi',
          'request_prescriptions'
        ];
    }
  };

  const signUp = async (data: SignUpData): Promise<{ success: boolean; message: string; user?: AuthUser }> => {
    // Artificial latency for Supabase Auth API call
    await new Promise((r) => setTimeout(r, 600));

    // Check if user already exists
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists in Supabase directory.' };
    }

    const defaultAvatars: Record<UserRole, string> = {
      doctor: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
      patient: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      receptionist: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      practice_manager: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      saas_admin: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    };

    const newUser: AuthUser = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      title: data.title || (data.role === 'doctor' ? 'Clinical Practitioner' : data.role === 'patient' ? 'Registered NHS Patient' : 'Practice Staff'),
      gmcNumber: data.gmcNumber,
      nhsNumber: data.nhsNumber || (data.role === 'patient' ? `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      clinicName: data.clinicName || 'St. James Health Centre (London)',
      avatar: defaultAvatars[data.role],
      is2FAEnabled: true,
      twoFactorMethod: data.role === 'patient' ? 'sms_otp' : 'nhs_smartcard',
      permissions: getPermissionsForRole(data.role),
      lastLoginAt: new Date().toISOString()
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);

    return {
      success: true,
      message: `Account created for ${data.name} as ${data.role.toUpperCase()}! You can now log in with your credentials.`,
      user: newUser
    };
  };

  const loginWithCredentials = async (
    email: string,
    _password: string,
    _otp?: string
  ): Promise<{ success: boolean; message?: string; user?: AuthUser }> => {
    await new Promise((r) => setTimeout(r, 400));

    const target = registeredUsers.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!target) {
      return {
        success: false,
        message: 'No account found with this email. Please click "Create Account (Sign Up)" to register first.'
      };
    }

    setCurrentUser(target);
    setIsAuthenticated(true);
    localStorage.setItem('medconnect_session_user', JSON.stringify(target));
    sessionStorage.setItem('medconnect_session_user', JSON.stringify(target));
    setSessionTimeLeftMinutes(60);
    setIsAuthModalOpen(false);

    return { success: true, user: target };
  };

  const loginAs = (role: UserRole, accountId?: string) => {
    let target = registeredUsers.find((a) => (accountId ? a.id === accountId : a.role === role));
    if (!target) target = registeredUsers.find((a) => a.role === role) || registeredUsers[0];

    setCurrentUser(target);
    setIsAuthenticated(true);
    localStorage.setItem('medconnect_session_user', JSON.stringify(target));
    sessionStorage.setItem('medconnect_session_user', JSON.stringify(target));
    setSessionTimeLeftMinutes(60);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('medconnect_session_user');
    sessionStorage.removeItem('medconnect_session_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateCurrentUser = (updated: Partial<AuthUser>) => {
    if (!currentUser) return;
    const newUserData = { ...currentUser, ...updated };
    setCurrentUser(newUserData);
    localStorage.setItem('medconnect_session_user', JSON.stringify(newUserData));
    sessionStorage.setItem('medconnect_session_user', JSON.stringify(newUserData));
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? newUserData : u))
    );
  };

  const hasPermission = (perm: Permission): boolean => {
    if (!isAuthenticated || !currentUser) return false;
    return currentUser.permissions.includes(perm);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        registeredUsers,
        isAuthenticated,
        loginAs,
        signUp,
        loginWithCredentials,
        logout,
        updateCurrentUser,
        hasPermission,
        isAuthModalOpen,
        setIsAuthModalOpen,
        sessionTimeLeftMinutes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
