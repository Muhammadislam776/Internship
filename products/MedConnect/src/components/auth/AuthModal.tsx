import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Lock,
  User,
  Stethoscope,
  KeyRound,
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  ArrowRight,
  Smartphone,
  Check,
  UserCircle2
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs, loginWithCredentials, currentUser, registeredUsers } = useAuth();
  const { setCurrentRole, setCurrentDoctorId, setCurrentPatientId, setActiveTab, showToast } = useApp();

  const [authMethod, setAuthMethod] = useState<'quick' | 'nhs_smartcard' | 'credentials'>('quick');
  const [email, setEmail] = useState('sarah.jenkins@stjamesgp.nhs.uk');
  const [password, setPassword] = useState('••••••••••••');
  const [otpCode, setOtpCode] = useState('748291');
  const [isSmartcardInserting, setIsSmartcardInserting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (acc: any) => {
    loginAs(acc.role, acc.id);
    setCurrentRole(acc.role);

    if (acc.role === 'doctor') {
      setCurrentDoctorId(acc.id);
      setActiveTab('scheduler');
    } else if (acc.role === 'patient') {
      setCurrentPatientId(acc.id);
      setActiveTab('patient_portal');
    } else if (acc.role === 'saas_admin') {
      setActiveTab('gmb_saas');
    } else if (acc.role === 'receptionist') {
      setActiveTab('scheduler');
    } else if (acc.role === 'practice_manager') {
      setActiveTab('rota');
    }

    showToast('success', `Signed In as ${acc.name}`, `Role: ${acc.role.toUpperCase()} — 2FA & RLS policies activated.`);
  };

  const handleNhsSmartcardLogin = async () => {
    setIsSmartcardInserting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSmartcardInserting(false);

    const doc = registeredUsers.find((a) => a.role === 'doctor') || registeredUsers[0];
    loginAs('doctor', doc.id);
    setCurrentRole('doctor');
    setCurrentDoctorId(doc.id);
    setActiveTab('scheduler');

    showToast('success', 'NHS Smartcard Authenticated', 'GMC Identity Verified via NHS Spine CIS2 Authentication Token.');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginWithCredentials(email, password, otpCode);
    if (res.success) {
      showToast('success', 'Authenticated Successfully', 'Encrypted JWT token issued. Active session initialized.');
    } else {
      showToast('error', 'Login Failed', res.message || 'Check credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-nhs-darkblue/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-nhs-blue/20 border border-nhs-blue/40 text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">MedConnect Authentication & RBAC Portal</h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  2FA & NHS CIS2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Secure Role-Based Access Control for UK Clinicians, Practice Staff, and Patients
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setAuthMethod('quick')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              authMethod === 'quick'
                ? 'border-nhs-blue text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>1-Click Role Switcher</span>
          </button>

          <button
            onClick={() => setAuthMethod('nhs_smartcard')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              authMethod === 'nhs_smartcard'
                ? 'border-nhs-blue text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-teal-400" />
            <span>NHS Smartcard / CIS2</span>
          </button>

          <button
            onClick={() => setAuthMethod('credentials')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              authMethod === 'credentials'
                ? 'border-nhs-blue text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>Email + 2FA OTP</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Option 1: 1-Click Persona Switcher */}
          {authMethod === 'quick' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Select a verified UK persona to test specific Row-Level Security (RLS) policies and permissions:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {registeredUsers.map((acc) => {
                  const isCurrent = currentUser?.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleQuickLogin(acc)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 group ${
                        isCurrent
                          ? 'bg-nhs-blue/20 border-nhs-blue ring-1 ring-nhs-blue'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {acc.name}
                            </h4>
                            <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                              {acc.role.replace('_', ' ')}
                            </span>
                            {acc.gmcNumber && (
                              <span className="text-[10px] text-teal-300 font-mono">
                                ({acc.gmcNumber})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {acc.title || acc.clinicName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrent ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                            <Check className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 group-hover:text-white font-semibold flex items-center gap-1">
                            Switch <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Option 2: NHS Smartcard CIS2 Simulation */}
          {authMethod === 'nhs_smartcard' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-nhs-blue/20 border border-nhs-blue/40 text-sky-400 flex items-center justify-center mx-auto shadow-xl">
                <CreditCard className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-base font-bold text-white">NHS Smartcard & Care Identity Service 2 (CIS2)</h4>
                <p className="text-xs text-slate-400">
                  Insert physical NHS Smartcard into USB reader or tap NHS Care Identity token to authenticate Dr. Sarah Jenkins (GMC 7489201).
                </p>
              </div>

              <button
                onClick={handleNhsSmartcardLogin}
                disabled={isSmartcardInserting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-nhs-blue to-teal-600 hover:from-nhs-brightblue hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-nhs-blue/30 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSmartcardInserting ? 'Reading Smartcard Chip...' : 'Simulate NHS Smartcard Insertion & Login'}
              </button>
            </div>
          )}

          {/* Option 3: Manual Credentials with 2FA */}
          {authMethod === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email / NHS Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nhs-blue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nhs-blue font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                    <span>2FA OTP Code</span>
                    <span className="text-[10px] text-emerald-400 font-mono">SMS Verified</span>
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nhs-blue font-mono"
                    placeholder="6-digit code"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-nhs-blue to-teal-600 hover:from-nhs-brightblue hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-nhs-blue/20 transition-all"
                >
                  Verify Credentials & Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Protected under NHS Information Governance Toolkit</span>
          <span className="text-emerald-400 font-mono">AES-256 Auth Tokens</span>
        </div>
      </div>
    </div>
  );
};
