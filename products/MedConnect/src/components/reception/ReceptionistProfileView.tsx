import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Building,
  Mail,
  ShieldCheck,
  Clock,
  Phone,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const ReceptionistProfileView: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
          {(currentUser?.name || 'HC')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">{currentUser?.name || 'Hannah Collins'}</h1>
          <p className="text-xs text-blue-600 font-semibold capitalize">
            {currentUser?.role?.replace('_', ' ') || 'Front Desk Coordinator'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser?.clinicName || 'St. James Health Centre'} · Station 1
          </p>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Workstation & Profile Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
            <p className="font-semibold text-slate-800">{currentUser?.email || 'hannah.collins@stjames.nhs.uk'}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Front Desk Station</span>
            <p className="font-semibold text-slate-800">Station A (Main Entrance Reception)</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Shift</span>
            <p className="font-semibold text-slate-800">08:00 – 16:30 (Monday – Friday)</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security State</span>
            <p className="font-semibold text-emerald-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 2FA Active · Authenticated
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">Front Desk Operational Preferences</h3>
          <div className="space-y-2 text-xs text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span>Play audio chime when calling patient to room</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span>Automatically send SMS confirmation upon new booking</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span>Display high-risk attendance indicator on today's appointments table</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
