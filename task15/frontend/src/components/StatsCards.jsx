import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  UserX, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { FlipCard } from './FlipCard';

export const StatsCards = ({ stats, loading }) => {
  const currentStats = stats || {
    totalUsers: 12540,
    newUsersMonth: 840,
    verifiedUsers: 9840,
    unverifiedUsers: 2700,
    activeUsers: 10210,
    adminUsers: 48
  };

  // Mini SVG Sparkline Generator
  const renderSparkline = (colorClass = '#22D3EE', data = [10, 25, 18, 30, 28, 45, 40, 60]) => (
    <svg className="w-20 h-8 opacity-80 overflow-visible" viewBox="0 0 100 40">
      <path
        d="M 0 30 Q 15 10 30 25 T 60 15 T 100 5"
        fill="none"
        stroke={colorClass}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="100" cy="5" r="3" fill={colorClass} className="animate-ping" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">

      {/* CARD 1: TOTAL USERS (3D FLIP CARD) */}
      <FlipCard
        height="h-40"
        front={
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9FB0C2] tracking-wide">Total Users</span>
              <div className="p-2 rounded-xl bg-[#2563EB]/20 text-[#22D3EE] border border-[#22D3EE]/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight font-mono">
                {loading ? '...' : currentStats.totalUsers?.toLocaleString()}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-[#22C55E] flex items-center font-semibold">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +12.4%
                </span>
                {renderSparkline('#22D3EE')}
              </div>
            </div>
          </div>
        }
        back={
          <div className="h-full flex flex-col justify-between text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-[#FFB86B]">Monthly Metrics</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A18]" />
            </div>
            <div className="space-y-1 my-auto">
              <div className="flex justify-between text-xs">
                <span className="text-[#9FB0C2]">New This Month</span>
                <span className="font-mono font-bold text-[#22D3EE]">+{currentStats.newUsersMonth}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9FB0C2]">Growth Rate</span>
                <span className="font-mono font-bold text-[#22C55E]">+7.2%</span>
              </div>
            </div>
            <p className="text-[9px] text-[#9FB0C2] italic">Click card to flip back</p>
          </div>
        }
      />

      {/* CARD 2: VERIFIED USERS (3D FLIP CARD) */}
      <FlipCard
        height="h-40"
        front={
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9FB0C2] tracking-wide">Verified Users</span>
              <div className="p-2 rounded-xl bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight font-mono">
                {loading ? '...' : currentStats.verifiedUsers?.toLocaleString()}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-[#22C55E] flex items-center font-semibold">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> 78.4%
                </span>
                {renderSparkline('#22C55E')}
              </div>
            </div>
          </div>
        }
        back={
          <div className="h-full flex flex-col justify-between text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-[#22D3EE]">Verification Index</span>
              <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
            </div>
            <div className="space-y-1.5 my-auto">
              <div className="flex justify-between text-xs">
                <span className="text-[#9FB0C2]">Verification Rate</span>
                <span className="font-mono font-bold text-[#22C55E]">78.4%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#22C55E] h-full rounded-full w-[78.4%]" />
              </div>
            </div>
            <p className="text-[9px] text-[#9FB0C2] italic">Click card to flip back</p>
          </div>
        }
      />

      {/* CARD 3: NEW USERS */}
      <div className="glass-card rounded-2xl p-4 border border-[#FF7A18]/30 hover:border-[#FF7A18] h-40 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9FB0C2]">New Users</span>
          <div className="p-2 rounded-xl bg-[#FF7A18]/20 text-[#FF7A18] border border-[#FF7A18]/40">
            <UserPlus className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight font-mono">
            {loading ? '...' : `+${currentStats.newUsersMonth}`}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#FFB86B] font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.2%
            </span>
            {renderSparkline('#FF7A18')}
          </div>
        </div>
      </div>

      {/* CARD 4: UNVERIFIED USERS */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 hover:border-amber-400/50 h-40 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9FB0C2]">Unverified</span>
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight font-mono">
            {loading ? '...' : currentStats.unverifiedUsers?.toLocaleString()}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-amber-400 font-semibold flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> 21.6%
            </span>
            {renderSparkline('#F59E0B')}
          </div>
        </div>
      </div>

      {/* CARD 5: ACTIVE USERS */}
      <div className="glass-card rounded-2xl p-4 border border-[#22D3EE]/30 hover:border-[#22D3EE] h-40 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9FB0C2]">Active Now</span>
          <div className="p-2 rounded-xl bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/30">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight font-mono">
            {loading ? '...' : currentStats.activeUsers?.toLocaleString()}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#22C55E] font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 81.4%
            </span>
            {renderSparkline('#22D3EE')}
          </div>
        </div>
      </div>

      {/* CARD 6: ADMIN USERS */}
      <div className="glass-card rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400 h-40 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9FB0C2]">Admin Users</span>
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight font-mono">
            {loading ? '...' : currentStats.adminUsers}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-purple-400 font-semibold">Secured Access</span>
            {renderSparkline('#A855F7')}
          </div>
        </div>
      </div>

    </div>
  );
};
