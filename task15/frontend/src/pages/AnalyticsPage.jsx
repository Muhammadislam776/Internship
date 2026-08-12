import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Users, 
  Zap, 
  PieChart, 
  ArrowUpRight, 
  Activity,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsPage = () => {
  const providers = [
    { name: 'Email Password', percent: 45, color: 'bg-[#2563EB]', count: '5,643' },
    { name: 'Google OAuth', percent: 30, color: 'bg-[#22D3EE]', count: '3,762' },
    { name: 'GitHub OAuth', percent: 15, color: 'bg-[#FF7A18]', count: '1,881' },
    { name: 'Enterprise SSO', percent: 10, color: 'bg-purple-500', count: '1,254' }
  ];

  const regions = [
    { country: 'United States', flag: '🇺🇸', active: '4,820', load: '38.4%' },
    { country: 'Germany', flag: '🇩🇪', active: '2,140', load: '17.1%' },
    { country: 'Japan', flag: '🇯🇵', active: '1,950', load: '15.5%' },
    { country: 'United Kingdom', flag: '🇬🇧', active: '1,680', load: '13.4%' },
    { country: 'India', flag: '🇮🇳', active: '1,950', load: '15.6%' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B253A]/90 border border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] mb-3">
            <BarChart3 className="w-4 h-4 text-[#22D3EE]" /> Live Telemetry &amp; Analytics Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            System Performance &amp; User Demographics
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C2] mt-1 max-w-2xl">
            In-depth statistical analytics, provider authentication distribution, and geographic traffic velocity.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl glass-card border border-[#22C55E]/40 text-center font-mono">
          <span className="text-[10px] text-[#9FB0C2] block">TELEMETRY AGENT</span>
          <span className="text-xs font-bold text-[#22C55E]">● Active (100ms sample)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-[#22D3EE]/30">
          <div className="flex justify-between items-center text-xs text-[#9FB0C2]">
            <span>Monthly Growth</span>
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-2">+24.8%</h3>
          <p className="text-[11px] text-[#22C55E] mt-1 font-semibold">+840 new accounts</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#FF7A18]/30">
          <div className="flex justify-between items-center text-xs text-[#9FB0C2]">
            <span>Avg Session Time</span>
            <Activity className="w-4 h-4 text-[#FF7A18]" />
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-2">18m 42s</h3>
          <p className="text-[11px] text-[#FFB86B] mt-1 font-semibold">+14.2% engagement</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-500/30">
          <div className="flex justify-between items-center text-xs text-[#9FB0C2]">
            <span>Verification Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-2">78.4%</h3>
          <p className="text-[11px] text-purple-300 mt-1 font-semibold">9,840 verified</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#22C55E]/30">
          <div className="flex justify-between items-center text-xs text-[#9FB0C2]">
            <span>Active Peak</span>
            <Users className="w-4 h-4 text-[#22C55E]" />
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-2">10,210</h3>
          <p className="text-[11px] text-[#22C55E] mt-1 font-semibold">Concurrent users</p>
        </div>
      </div>

      {/* Grid: Provider Distribution & Regional Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth Provider Distribution */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#22D3EE]" /> Auth Provider Distribution
            </h3>
            <span className="text-xs font-mono text-[#9FB0C2]">12,540 total</span>
          </div>

          <div className="space-y-4 pt-2">
            {providers.map((p, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{p.name}</span>
                  <span className="font-mono text-[#22D3EE]">{p.count} ({p.percent}%)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div className={`${p.color} h-full rounded-full transition-all duration-500`} style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Traffic Heatmap */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#FF7A18]" /> Regional User Load
            </h3>
            <span className="text-xs font-mono text-[#FFB86B]">Global CDNs</span>
          </div>

          <div className="space-y-3">
            {regions.map((reg, idx) => (
              <div key={idx} className="p-3 rounded-2xl glass-card flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{reg.flag}</span>
                  <span className="font-bold text-white">{reg.country}</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-[#9FB0C2]">{reg.active} active</span>
                  <span className="text-[#22D3EE] font-bold">{reg.load}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
