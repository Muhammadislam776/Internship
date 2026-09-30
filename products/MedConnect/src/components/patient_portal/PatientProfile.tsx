import React, { useState } from 'react';
import { Patient } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  X,
  Building2,
  Lock
} from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ patient }) => {
  const { updateCurrentUser, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [editName, setEditName] = useState(`${patient.firstName} ${patient.lastName}`.trim());
  const [editPhone, setEditPhone] = useState(patient.phone || '+44 7700 900555');
  const [editAddress, setEditAddress] = useState(
    patient.address ? `${patient.address.line1}, ${patient.address.city}, ${patient.address.postcode}` : '12 St. James Square, London, SW1Y 4LE'
  );
  const [editEmergencyName, setEditEmergencyName] = useState(patient.emergencyContact?.name || 'Sarah Jutt');
  const [editEmergencyRelation, setEditEmergencyRelation] = useState(patient.emergencyContact?.relationship || 'Next of Kin');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(patient.emergencyContact?.phone || '+44 7700 900556');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: editName,
      phone: editPhone
    } as any);

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your personal NHS registration details and emergency contacts
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile Details
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile updated successfully in your MedConnect clinical record.</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-bold flex items-center justify-center shrink-0 shadow-xs">
          {patient.firstName[0]}{patient.lastName ? patient.lastName[0] : ''}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {patient.firstName} {patient.lastName}
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              NHS Patient Verified
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Registered Patient at {patient.gpPracticeName || 'St. James Health Centre'}
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Personal Information */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Personal Information
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Full Name</span>
              <strong className="text-slate-900">{patient.firstName} {patient.lastName}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Date of Birth</span>
              <span className="text-slate-800">{patient.dob || '15 June 1992'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Contact Phone</span>
              <span className="text-slate-800 font-medium">{patient.phone || '+44 7700 900555'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email Address</span>
              <span className="text-slate-800">{patient.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Home Address</span>
              <span className="text-slate-800 text-right max-w-xs">{editAddress}</span>
            </div>
          </div>
        </div>

        {/* 2. Healthcare & NHS Registration */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Healthcare & NHS Registration
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">NHS Number</span>
              <strong className="font-mono text-blue-700 font-bold tracking-wider">
                {patient.nhsNumber || '485 772 9012'}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Registered Practice</span>
              <span className="text-slate-900 font-medium">St. James Health Centre (London)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Preferred Doctor</span>
              <span className="text-slate-800">Dr. Sarah Jenkins</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Prescribing Pharmacy</span>
              <span className="text-slate-800">Boots Pharmacy (Piccadilly)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Communication Preference</span>
              <span className="text-slate-800 font-semibold">SMS & Secure Email</span>
            </div>
          </div>
        </div>

        {/* 3. Emergency Contact */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Emergency Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-[11px]">Contact Name</p>
              <p className="font-bold text-slate-900 mt-1">{editEmergencyName}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-[11px]">Relationship</p>
              <p className="font-bold text-slate-900 mt-1">{editEmergencyRelation}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-[11px]">Emergency Phone</p>
              <p className="font-bold text-slate-900 mt-1">{editEmergencyPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Home Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900 mb-2">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Name</label>
                    <input
                      type="text"
                      value={editEmergencyName}
                      onChange={(e) => setEditEmergencyName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Relationship</label>
                    <input
                      type="text"
                      value={editEmergencyRelation}
                      onChange={(e) => setEditEmergencyRelation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={editEmergencyPhone}
                    onChange={(e) => setEditEmergencyPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
