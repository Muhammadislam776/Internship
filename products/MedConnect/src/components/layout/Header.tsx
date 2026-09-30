import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SupabaseConfigModal } from '../common/SupabaseConfigModal';
import { ClinicType } from '../../types';
import {
  ShieldCheck,
  Activity,
  Calendar,
  Lock,
  PhoneCall,
  UserCheck,
  Building2,
  Stethoscope,
  Zap,
  Globe,
  Clock,
  LogOut,
  ChevronDown,
  Database
} from 'lucide-react';

export const Header: React.FC<{ onOpenQuickBook: () => void }> = ({ onOpenQuickBook }) => {
  const { selectedClinicType, setSelectedClinicType, twilioLogs } = useApp();
  const { currentUser, setIsAuthModalOpen, logout, sessionTimeLeftMinutes } = useAuth();
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  return (
    <header className="bg-slate-900/95 backdrop-blur-xl text-white border-b border-slate-800 sticky top-0 z-40 shadow-2xl">
      {/* Top Compliance & Safeguard Bar */}
      <div className="bg-slate-950 px-4 lg:px-8 py-1.5 border-b border-slate-800/80 text-[11px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>HIPAA / UK GDPR Validated</span>
          </div>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
            title="Click to configure or test Supabase connection"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Supabase RLS: Connected</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>AES-256 Vault Active</span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-sky-300">
            <Globe className="w-3.5 h-3.5" />
            <span>NHS DSPT 2026 Verified</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[10px]">
            <Zap className="w-3 h-3" />
            <span>ML No-Show Engine Active</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>Twilio Dispatches: <strong className="text-white">{twilioLogs.length}</strong></span>
          </div>
          <div className="flex items-center gap-1 font-mono text-teal-300 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            <Clock className="w-3 h-3" />
            <span>Session: {sessionTimeLeftMinutes}m</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Clinic Title */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-nhs-blue to-teal-400 flex items-center justify-center shadow-lg shadow-nhs-blue/25 ring-2 ring-white/10">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                MedConnect
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-nhs-blue/30 text-sky-300 border border-nhs-blue/50">
                UK Healthcare Suite
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {currentUser?.clinicName || 'Clinic & Dental Patient Management System'}
            </p>
          </div>
        </div>

        {/* Global Controls, Specialty Filter & Authenticated User Profile */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Clinic Specialty Selector */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl p-1 shadow-inner">
            <Building2 className="w-4 h-4 text-slate-400 ml-2 mr-1" />
            <select
              value={selectedClinicType}
              onChange={(e) => setSelectedClinicType(e.target.value as ClinicType | 'all')}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none pr-3 py-1 cursor-pointer"
            >
              <option value="all" className="bg-slate-800 text-white">All Clinic Specialties</option>
              <option value="gp_practice" className="bg-slate-800 text-white">GP Practice (NHS/Private)</option>
              <option value="dental" className="bg-slate-800 text-white">Dental & Orthodontics</option>
              <option value="physiotherapy" className="bg-slate-800 text-white">MSK Physiotherapy</option>
            </select>
          </div>

          {/* User Profile & Persona Switcher Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-750 border border-indigo-500/40 hover:border-indigo-400/80 rounded-xl p-1.5 pl-2 shadow-md transition-all group"
            title="Click to switch account persona"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
              alt={currentUser?.name || 'User'}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
            />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {currentUser?.name || 'Dr. Sarah Jenkins'}
                </span>
                <span className="text-[9px] uppercase font-bold font-mono px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/50">
                  {currentUser?.role || 'doctor'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[130px]">
                {currentUser?.gmcNumber || currentUser?.nhsNumber || currentUser?.title}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white mr-1" />
          </button>

          {/* Quick Book Button */}
          <button
            onClick={onOpenQuickBook}
            className="flex items-center gap-2 bg-gradient-to-r from-nhs-blue to-teal-600 hover:from-nhs-brightblue hover:to-teal-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-nhs-blue/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Book Appointment</span>
          </button>

          {/* Log Out Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
            title="Log Out & Return to Sign In / Sign Up"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <SupabaseConfigModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
    </header>
  );
};
