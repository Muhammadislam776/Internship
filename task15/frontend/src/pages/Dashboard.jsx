import React from 'react';
import { LayoutDashboard, Users, ShieldCheck, Zap, ArrowUpRight, BarChart3, Activity } from 'lucide-react';
import { StatsCards } from '../components/StatsCards';
import { Analytics } from '../components/Analytics';
import { ActivityTimeline } from '../components/ActivityTimeline';

export const Dashboard = ({ userHook, setActiveTab }) => {
  const { stats, loading } = userHook;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Welcome Header */}
      <div className="glass-panel rounded-3xl p-8 border border-[#22D3EE]/25 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#22D3EE] text-xs font-mono border border-[#22D3EE]/30 mb-3">
              <Zap className="w-3.5 h-3.5" /> SYSTEM EXECUTIVE OVERVIEW
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Platform Overview &amp; Health
            </h1>
            <p className="text-xs sm:text-sm text-[#9FB0C2] mt-1">
              Real-time monitoring metrics across user accounts, authentication security, and infrastructure nodes.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#22D3EE] text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
          >
            <span>Open User Command Center</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <StatsCards stats={stats} loading={loading} />
      <Analytics />
      <ActivityTimeline />
    </div>
  );
};
