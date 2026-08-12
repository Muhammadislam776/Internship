import React from 'react';
import { ShieldCheck, Lock, Sparkles, RefreshCw, ArrowUpRight } from 'lucide-react';

export const HeroSection = ({ 
  onRefresh, 
  onAddUser, 
  loading, 
  totalUsersCount 
}) => {
  return (
    <section className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/25 shadow-2xl overflow-hidden mb-8">
      {/* Background Decorative Glow Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-[#2563EB]/25 to-[#22D3EE]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-[#FF7A18]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {/* Security Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B253A]/90 border border-[#22D3EE]/40 text-xs font-semibold mb-4 text-[#22D3EE] shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
            <span>Protected by Server-Side Supabase Admin Access</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            User <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22D3EE] via-[#2563EB] to-[#FFB86B]">Command Center</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9FB0C2] mt-2 max-w-2xl leading-relaxed">
            Monitor, inspect, and manage your enterprise platform users from one secure, high-performance portal.
          </p>

          {/* Additional Security Specs Banner */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#9FB0C2]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#22D3EE]">
              <Lock className="w-3.5 h-3.5" />
              <span>Service Role Key strictly inside backend .env</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-white font-bold">{totalUsersCount || 12540}</span> Registered Accounts
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-xs font-semibold text-white hover:text-[#22D3EE] border border-white/10 hover:border-[#22D3EE]/50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#22D3EE] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Users</span>
          </button>

          <button
            onClick={onAddUser}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] text-white font-bold text-xs shadow-lg shadow-[#FF7A18]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>+ Add New User</span>
          </button>
        </div>
      </div>
    </section>
  );
};
