import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Key,
  Bell,
  CheckCircle2,
  Mail,
  Smartphone,
  Save
} from 'lucide-react';

export const PatientPrivacySecurity: React.FC = () => {
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [careTeamSharing, setCareTeamSharing] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Privacy & Security
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your healthcare information is protected with appropriate security controls
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your privacy and communication preferences have been updated.</span>
        </div>
      )}

      {/* 1. Account Security */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Login & Security</h2>
            <p className="text-xs text-slate-500">Authentication and session controls</p>
          </div>
        </div>

        <div className="space-y-3 text-xs pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">SMS OTP verification for appointment booking & prescription access</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Enabled ✓
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Automatic Session Timeout</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Protects your patient portal if your computer or phone is left unattended</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              60 Minutes
            </span>
          </div>
        </div>
      </div>

      {/* 2. Communication Preferences */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Appointment Reminders & Notifications</h2>
            <p className="text-xs text-slate-500">Choose how the clinic contacts you about your care</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={smsReminders}
              onChange={(e) => setSmsReminders(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" /> SMS Text Reminders
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Receive SMS confirmation and reminder links 24 hours before your consultation.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={emailReminders}
              onChange={(e) => setEmailReminders(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Notifications
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Receive electronic booking summaries, calendar invites, and pharmacy notification updates.
              </p>
            </div>
          </label>
        </div>

        {/* 3. Data & Clinical Consent */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Data Access & Clinical Sharing
          </h3>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={careTeamSharing}
              onChange={(e) => setCareTeamSharing(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">Direct Clinical Care Team Access</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Allow St. James Health Centre doctors, nurses, and authorized care coordinators to access your consultation history and questionnaire results.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
