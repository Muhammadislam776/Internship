import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { SupabaseConfigModal } from '../common/SupabaseConfigModal';
import {
  Activity,
  User,
  Stethoscope,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Lock,
  ArrowLeft,
  Database,
  Briefcase,
  ShieldAlert
} from 'lucide-react';

interface AuthPageProps {
  onBackToHome?: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBackToHome, defaultMode = 'login' }) => {
  const { signUp, loginWithCredentials } = useAuth();
  const { showToast, setCurrentRole, setCurrentDoctorId, setCurrentPatientId, setActiveTab } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(defaultMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Sign Up State
  const [signupRole, setSignupRole] = useState<UserRole>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gmcNumber, setGmcNumber] = useState('GMC 7489201');
  const [nhsNumber, setNhsNumber] = useState('485 772 9012');
  const [clinicName, setClinicName] = useState('St. James Health Centre (London)');

  // Sign In State - prefill with user's registered email if available
  const [loginEmail, setLoginEmail] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('medconnect_users');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check for recently created user
          const custom = parsed.find(
            (u: any) => u.id && !['doc_1', 'pat_1', 'rec_1', 'mgr_1', 'admin_1'].includes(u.id)
          );
          if (custom?.email) return custom.email;
        }
      }
    } catch {}
    return '';
  });
  const [loginPassword, setLoginPassword] = useState('');

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        role: signupRole,
        gmcNumber: signupRole === 'doctor' ? gmcNumber : undefined,
        nhsNumber: signupRole === 'patient' ? nhsNumber : undefined,
        clinicName: clinicName.trim()
      });

      if (res.success && res.user) {
        // Automatically sign in with the new account
        const loginRes = await loginWithCredentials(email.trim(), password);
        if (loginRes.success && loginRes.user) {
          setCurrentRole(loginRes.user.role);
          if (loginRes.user.role === 'doctor') {
            setCurrentDoctorId(loginRes.user.id);
            setActiveTab('schedule');
          } else if (loginRes.user.role === 'patient') {
            setCurrentPatientId(loginRes.user.id);
            setActiveTab('portal');
          } else if (loginRes.user.role === 'receptionist') {
            setActiveTab('scheduler');
          } else if (loginRes.user.role === 'practice_manager') {
            setActiveTab('rota');
          } else if (loginRes.user.role === 'saas_admin') {
            setActiveTab('gmb_saas');
          }
          showToast('success', `Welcome, ${loginRes.user.name}`, `Assigned to your ${loginRes.user.role.toUpperCase()} workspace.`);
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Registration error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    setIsSubmitting(true);
    try {
      const res = await loginWithCredentials(loginEmail, loginPassword);
      if (res.success && res.user) {
        setCurrentRole(res.user.role);
        if (res.user.role === 'doctor') {
          setCurrentDoctorId(res.user.id);
          setActiveTab('schedule');
        } else if (res.user.role === 'patient') {
          setCurrentPatientId(res.user.id);
          setActiveTab('portal');
        } else if (res.user.role === 'saas_admin') {
          setActiveTab('gmb_saas');
        } else if (res.user.role === 'receptionist') {
          setActiveTab('scheduler');
        } else if (res.user.role === 'practice_manager') {
          setActiveTab('rota');
        }
        showToast('success', 'Signed In', `Welcome back, ${res.user.name}`);
      } else {
        setErrorMessage(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage('Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 relative selection:bg-blue-600 selection:text-white">
      {/* Top Bar with Home Link & Supabase Button */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between pt-2">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Website</span>
          </button>
        )}

        <button
          onClick={() => setIsSupabaseModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors ml-auto"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Connect Supabase Backend</span>
        </button>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md mx-auto my-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-1">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              ClinicFlow UK
            </h1>
            <p className="text-xs text-slate-500">
              Sign in or create your account to access your role workspace
            </p>
          </div>

          {/* Segmented Tab Control */}
          <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address / NHS Mail
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@stjamesgp.nhs.uk"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. SIGN UP FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 animate-fade-in">
              {/* Clean Role Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  I am registering as:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'patient', label: 'Patient', icon: User },
                    { id: 'doctor', label: 'Doctor', icon: Stethoscope },
                    { id: 'receptionist', label: 'Reception', icon: Building2 },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = signupRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSignupRole(r.id as UserRole)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="text-[11px] block leading-tight">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  placeholder={signupRole === 'doctor' ? 'Dr. Sarah Jenkins' : 'Oliver Bennett'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="user@example.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
              </div>

              {signupRole === 'doctor' && (
                <div>
                  <label className="text-xs font-semibold text-blue-700 block mb-1">GMC / GDC Number</label>
                  <input
                    type="text"
                    value={gmcNumber}
                    onChange={(e) => setGmcNumber(e.target.value)}
                    className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none font-mono"
                    placeholder="GMC 7489201"
                    required
                  />
                </div>
              )}

              {signupRole === 'patient' && (
                <div>
                  <label className="text-xs font-semibold text-blue-700 block mb-1">NHS Number</label>
                  <input
                    type="text"
                    value={nhsNumber}
                    onChange={(e) => setNhsNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none font-mono"
                    placeholder="485 772 9012"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Clinic / Practice Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                  placeholder="St. James Health Centre (London)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Complete Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}


        </div>
      </div>

      {/* Trust Footer */}
      <div className="py-2 text-center text-xs text-slate-500 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> AES-256 Encrypted</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> Supabase RLS</span>
        <span>•</span>
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> UK GDPR & HIPAA</span>
      </div>

      <SupabaseConfigModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
    </div>
  );
};
