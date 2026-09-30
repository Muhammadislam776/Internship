import React from 'react';
import { Activity, ArrowRight, LogIn } from 'lucide-react';

interface PublicHeaderProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenAuth }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro trust banner */}
      <div className="bg-blue-900 text-white text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Designed with UK GDPR & HIPAA requirements in mind</span>
            <span className="hidden md:inline text-blue-300">•</span>
            <span className="hidden md:inline text-blue-200">NHS EPS Release 2 Compatible Architecture</span>
          </div>
          <div className="flex items-center gap-3 text-blue-200">
            <span className="hidden sm:inline">Multi-Tenant Clinic SaaS</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-white font-semibold">24/7 NHS CIS2 Ready</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">ClinicFlow</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                UK Healthcare SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Smart Clinic Management & Telemedicine</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#telemedicine" className="hover:text-blue-600 transition-colors">Telemedicine</a>
          <a href="#solutions" className="hover:text-blue-600 transition-colors">Specialties</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#security" className="hover:text-blue-600 transition-colors">Compliance & Security</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => onOpenAuth('register')}
            className="flex items-center gap-1 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-200 transition-all active:scale-[0.98]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
