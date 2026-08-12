import React from 'react';
import { BarChart3, PieChart, TrendingUp, Shield, Users } from 'lucide-react';

export const Analytics = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const growthData = [320, 480, 610, 790, 940, 1120, 1340, 1580];
  const roleDistribution = [
    { label: 'Standard Users', percent: 76, count: '9,530', color: 'bg-[#2563EB]' },
    { label: 'Verified Accounts', percent: 78, count: '9,840', color: 'bg-[#22D3EE]' },
    { label: 'Moderators', percent: 18, count: '2,250', color: 'bg-[#FF7A18]' },
    { label: 'Administrators', percent: 6, count: '760', color: 'bg-purple-500' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-[#22D3EE]/20 shadow-2xl space-y-6 mb-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#22D3EE]" /> User Analytics &amp; Demographics
          </h2>
          <p className="text-xs text-[#9FB0C2] mt-0.5">Real-time platform usage metrics and registration velocity</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-xs font-mono border border-[#22C55E]/30">
          ● Live Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: REGISTRATION TRENDS (Bar chart) */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#22D3EE]" /> Monthly User Growth Velocity
            </h3>
            <span className="text-xs text-[#FFB86B] font-mono">+24.5% vs last period</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-white/10">
            {months.map((m, i) => {
              const heightPercent = (growthData[i] / 1600) * 100;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <span className="text-[10px] font-mono text-[#9FB0C2] opacity-0 group-hover:opacity-100 transition-opacity">
                    {growthData[i]}
                  </span>
                  <div className="w-full bg-[#071A2B] rounded-t-lg h-36 flex items-end overflow-hidden">
                    <div 
                      className="w-full bg-gradient-to-t from-[#2563EB] to-[#22D3EE] rounded-t-lg group-hover:from-[#FF7A18] group-hover:to-[#FFB86B] transition-all duration-500 shadow-lg" 
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#9FB0C2]">{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: ROLE DISTRIBUTION */}
        <div className="p-5 rounded-2xl glass-card border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#FF7A18]" /> Role Distribution
            </h3>
            <p className="text-xs text-[#9FB0C2] mt-0.5">Platform privilege breakdown</p>
          </div>

          <div className="space-y-3 my-auto">
            {roleDistribution.map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{r.label}</span>
                  <span className="font-mono text-[#22D3EE]">{r.count} ({r.percent}%)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className={`${r.color} h-full rounded-full transition-all duration-500`} style={{ width: `${r.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <span className="text-[11px] text-[#9FB0C2]">Total System Accounts: <strong className="text-white font-mono">12,540</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
