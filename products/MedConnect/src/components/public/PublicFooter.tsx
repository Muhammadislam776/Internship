import React from 'react';
import { Activity, ShieldCheck, Lock, Globe, HeartPulse, CheckCircle2 } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ClinicFlow UK</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The modern, cloud-native clinic management and telemedicine operating system for UK GP surgeries, dental practices, physiotherapy clinics, and healthcare groups.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>UK GDPR Art 32 Encrypted</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-sky-400 border border-slate-700">
                <Lock className="w-3.5 h-3.5" />
                <span>AES-256 Vault</span>
              </span>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Core Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Intelligent Scheduling</a></li>
              <li><a href="#telemedicine" className="hover:text-white transition-colors">HD Telemedicine Room</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">ML No-Show Prediction</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Digital Intake Forms</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">NHS EPS R2 Prescriptions</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Staff Rota & Utilization</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Specialties</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#solutions" className="hover:text-white transition-colors">NHS & Private GP Clinics</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Dental & Orthodontics</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">MSK Physiotherapy</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Multi-Clinic Groups</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">SaaS Pricing Tiers</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Security & Trust</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span>Designed with GDPR/HIPAA</span></li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span>Supabase Multi-Tenant RLS</span></li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span>Twilio SMS & Voice Auth</span></li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span>Google Calendar 2-Way Sync</span></li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span>Full Audit Logging</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>&copy; {new Date().getFullYear()} ClinicFlow Healthcare Technologies UK Ltd. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of SaaS Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">DPO & Information Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
