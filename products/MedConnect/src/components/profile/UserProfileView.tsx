import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Award,
  Key,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  FileBadge,
  Sparkles,
  Camera,
  MapPin,
  Clock,
  Lock,
  ExternalLink,
  Stethoscope
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast, setActiveTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    title: currentUser?.title || (currentUser?.role === 'doctor' ? 'Senior GP Partner & Clinical Lead' : 'Lead Practice Receptionist'),
    phone: '+44 20 7946 0192',
    clinicName: currentUser?.clinicName || 'St. James Health Centre (London W1)',
    gmcNumber: currentUser?.gmcNumber || (currentUser?.role === 'doctor' ? 'GMC 7489201' : 'STF-REC-8921'),
    specialty: currentUser?.role === 'doctor' ? 'Primary Care & Chronic Disease Management' : 'Front Desk & Patient Care Coordination',
    bio: currentUser?.role === 'doctor'
      ? 'GMC-registered General Practitioner with over 14 years clinical experience in NHS primary care, acute telemedicine, and complex disease management.'
      : 'Experienced healthcare administrator managing patient bookings, Twilio triage SMS notifications, and front-desk clinic operations.'
  });

  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  );

  const presetAvatars = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1594824813576-92892d1a3371?auto=format&fit=crop&q=80&w=300'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      title: formData.title.trim(),
      clinicName: formData.clinicName.trim(),
      gmcNumber: formData.gmcNumber.trim(),
      avatar: avatarUrl
    });

    setIsEditing(false);
    showToast('success', 'Profile Updated Successfully', 'Your clinician credentials and contact info have been synchronized.');
  };

  const roleBadgeStyle: Record<string, { bg: string; text: string; label: string }> = {
    doctor: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Registered Clinician (GP)' },
    receptionist: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', label: 'Practice Receptionist' },
    practice_manager: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'Practice Operations Lead' },
    patient: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Registered NHS Patient' },
    saas_admin: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-800', label: 'Platform SuperAdmin' }
  };

  const roleInfo = roleBadgeStyle[currentUser?.role || 'doctor'] || roleBadgeStyle.doctor;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* ── Top Header Profile Card ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={currentUser?.name || 'User'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {currentUser?.name || 'Dr. Sarah Jenkins'}
                </h1>
                <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${roleInfo.bg} ${roleInfo.text}`}>
                  {roleInfo.label}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {formData.title}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  {currentUser?.clinicName || 'St. James Health Centre'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-mono font-semibold text-blue-700">
                  <FileBadge className="w-3.5 h-3.5 text-blue-600" />
                  {formData.gmcNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => setActiveTab('availability')}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>My Availability</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Form / Details Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Personal & Clinical Information (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Personal & Practice Information
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              NHS DSPT Compliant
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Preset Avatars Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3">
                  {presetAvatars.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatarUrl(url)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                        avatarUrl === url ? 'border-blue-600 ring-2 ring-blue-200 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">NHS / Clinic Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Professional Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Registration / Staff ID *</label>
                  <input
                    type="text"
                    value={formData.gmcNumber}
                    onChange={(e) => setFormData({ ...formData, gmcNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Clinic Branch *</label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Direct Extension / Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Specialty & Clinical Scope</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">{formData.email}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Direct Phone</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">{formData.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Specialty</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">{formData.specialty}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GMC / Staff Register</span>
                  <span className="text-xs font-bold text-blue-700 font-mono mt-0.5 block">{formData.gmcNumber}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Statement</span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">{formData.bio}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Verified Credentials & Access Permissions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Statutory Credentials Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Verified Statutory Accreditations
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Up to Date
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Enhanced DBS Certificate</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Ref: DBS-2026-08914A</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Valid to 2027
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-amber-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">NHS Smartcard Cryptographic UID</h4>
                    <p className="text-[10px] text-slate-500 font-mono">UID: 9481-0023-8812</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  Level 4 Access
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <FileBadge className="w-4 h-4 text-indigo-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Medical Defence Union (MDU)</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Policy #MDU-LON-7419</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Active Role Permissions Ledger */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Authorized Security Permissions</span>
              <span className="text-[10px] text-slate-400 font-normal">Role-Based Access</span>
            </h3>

            <div className="space-y-1.5">
              {(currentUser?.permissions || ['view_all_patient_phi', 'sign_prescriptions', 'manage_appointments']).map((perm) => (
                <div key={perm} className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-slate-50 text-slate-700 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-mono text-[11px] font-medium">{perm.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('settings')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Security & Account Settings</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
