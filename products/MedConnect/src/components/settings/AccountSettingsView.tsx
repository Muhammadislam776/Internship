import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Shield,
  Lock,
  Key,
  Smartphone,
  Bell,
  Database,
  Globe,
  CheckCircle2,
  AlertCircle,
  Save,
  Laptop,
  LogOut,
  RefreshCw,
  Sliders,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export const AccountSettingsView: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast, auditLogs } = useApp();

  const [activeSection, setActiveSection] = useState<'security' | 'notifications' | 'integrations' | 'compliance'>('security');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(currentUser?.is2FAEnabled ?? true);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'nhs_smartcard' | 'authenticator_app' | 'sms_otp'>(
    currentUser?.twoFactorMethod || 'nhs_smartcard'
  );

  // Notification Preferences
  const [notifPreferences, setNotifPreferences] = useState({
    urgentArrivals: true,
    prescriptionRefills: true,
    highRiskNoShow: true,
    dailyScheduleDigest: true,
    systemUpdates: false
  });

  // Active Sessions
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows 11 PC (Clinic Consultation Room 3)',
      browser: 'Google Chrome 124.0',
      ip: '86.134.22.190 (St. James Clinic VLAN)',
      isCurrent: true,
      lastActive: 'Active now'
    },
    {
      id: 'sess-2',
      device: 'Apple iPad Pro (Mobile Ward Round)',
      browser: 'Safari Mobile 17.4',
      ip: '86.134.22.195 (NHS Private WiFi)',
      isCurrent: false,
      lastActive: '2 hours ago'
    }
  ]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('error', 'Password Required', 'Please enter your current and new password.');
      return;
    }
    if (newPassword.length < 8) {
      showToast('error', 'Weak Password', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords Do Not Match', 'Confirmation password does not match.');
      return;
    }

    showToast('success', 'Password Changed', 'Your clinical account password has been updated securely.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveSecurity = () => {
    updateCurrentUser({
      is2FAEnabled,
      twoFactorMethod
    });
    showToast('success', 'Security Settings Saved', 'Two-Factor Authentication protocol updated.');
  };

  const handleTerminateOtherSessions = () => {
    setActiveSessions(activeSessions.filter((s) => s.isCurrent));
    showToast('info', 'Sessions Terminated', 'Logged out of all secondary clinical devices and terminals.');
  };

  const handleExportAuditLogs = () => {
    const jsonStr = JSON.stringify(auditLogs.slice(0, 50), null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medconnect_audit_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Audit Log Exported', 'Downloaded encrypted clinical activity record.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* ── Header ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Account & Security Settings
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  GMC Smartcard Protected
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your credentials, two-factor authentication, notification triggers, and connected healthcare APIs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Settings Sub-Navigation Tabs ── */}
      <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs gap-1 overflow-x-auto">
        {[
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
          { id: 'integrations', label: 'Cloud & API Integrations', icon: Globe },
          { id: 'compliance', label: 'GDPR & Audit Ledger', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 min-w-[170px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Security & 2FA ── */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Password Change (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Lock className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Change Account Password</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">New Strong Password *</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters with symbol"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  {is2FAEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Require 2FA on Sign-In</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Mandatory for NHS Spine & Electronic Prescribing access.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    is2FAEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 block">Preferred 2FA Method</label>
                {[
                  { id: 'nhs_smartcard', label: 'NHS Smartcard Token', sub: 'Hardware token / smartcard reader', badge: 'Recommended' },
                  { id: 'authenticator_app', label: 'Mobile Authenticator App', sub: 'Google Authenticator / Microsoft Authenticator (TOTP)' },
                  { id: 'sms_otp', label: 'SMS One-Time Passcode', sub: 'Passcode sent via Twilio SMS to registered phone' }
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      twoFactorMethod === m.id ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-200' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="twoFactorMethod"
                        checked={twoFactorMethod === m.id}
                        onChange={() => setTwoFactorMethod(m.id as any)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{m.label}</span>
                          {m.badge && (
                            <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{m.sub}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveSecurity}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all"
              >
                Save 2FA Preferences
              </button>
            </div>
          </div>

          {/* Active Sessions & Devices */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Active Authorized Clinic Sessions</h3>
              </div>
              <button
                onClick={handleTerminateOtherSessions}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
              >
                Log Out Other Sessions
              </button>
            </div>

            <div className="space-y-2.5">
              {activeSessions.map((s) => (
                <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{s.device}</span>
                        {s.isCurrent && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {s.browser} • {s.ip}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{s.lastActive}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Notification Preferences ── */}
      {activeSection === 'notifications' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Clinical Notification Triggers</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose which operational alerts and SMS triggers deliver to your desktop and phone.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                key: 'urgentArrivals' as const,
                title: 'Urgent Patient Arrivals & Check-ins',
                desc: 'Audible chime and alert badge when a patient arrives at reception.'
              },
              {
                key: 'prescriptionRefills' as const,
                title: 'Prescription Refill Requests Pending',
                desc: 'Alert when a repeat medication request is queued for GMC authorization.'
              },
              {
                key: 'highRiskNoShow' as const,
                title: 'High No-Show Risk Bookings',
                desc: 'Notify when machine learning identifies an appointment risk above 60%.'
              },
              {
                key: 'dailyScheduleDigest' as const,
                title: 'Daily Morning Schedule Briefing',
                desc: 'Automated 07:30 AM summary of your upcoming clinic visits.'
              },
              {
                key: 'systemUpdates' as const,
                title: 'Clinical System & Downtime Advisories',
                desc: 'Notices regarding scheduled NHS Spine maintenance or EPS upgrades.'
              }
            ].map((n) => (
              <div
                key={n.key}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifPreferences({ ...notifPreferences, [n.key]: !notifPreferences[n.key] })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notifPreferences[n.key] ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifPreferences[n.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => showToast('success', 'Preferences Saved', 'Clinical notification rules updated.')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Cloud & API Integrations ── */}
      {activeSection === 'integrations' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Healthcare Infrastructure Connections</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status and endpoint configurations for NHS Spine, Twilio SMS, and Cloud Database.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Supabase Cloud Database & RLS Vault</h4>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100/70 text-emerald-800 px-2 py-0.2 rounded-full">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    https://qgkjilkbsarwvtumeqcv.supabase.co
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">Ping: 18ms</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Twilio Healthcare 2-Way SMS Gateway</h4>
                    <span className="text-[10px] font-mono font-bold bg-blue-100/70 text-blue-800 px-2 py-0.2 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    Account: AC89410... • Delivery Rate: 99.4%
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">Balance: £142.80</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">NHS Digital Spine & EPS Release 2</h4>
                    <span className="text-[10px] font-mono font-bold bg-purple-100/70 text-purple-800 px-2 py-0.2 rounded-full">
                      Certified Endpoints
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    ODS: FA391 • Spine Mesh Mailbox Active
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">TLS 1.3</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: GDPR & Compliance ── */}
      {activeSection === 'compliance' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">UK GDPR Compliance & Audit Exports</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory audit logs required by the Information Commissioner's Office (ICO) and Care Quality Commission (CQC).
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Export Clinician Activity Ledger</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Download an immutable JSON record of all PHI decryptions, EPS authorizations, and appointment updates.
                </p>
              </div>
              <button
                onClick={handleExportAuditLogs}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Audit JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Data Protection Officer (DPO) Notice</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Under UK GDPR Article 9(2)(h) and the Health and Social Care Act 2012, medical records are retained under clinical necessity for a minimum statutory duration of 8 years. All access events are cryptographically hashed and monitored by the Practice Caldicott Guardian.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
