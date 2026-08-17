import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Mail, FileCode2, BarChart3, Settings, CheckCircle2, Cpu, Server } from 'lucide-react';

export default function Sidebar({ className = '' }) {
  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Events', path: '/events', icon: Database },
    { name: 'Email Logs', path: '/emails', icon: Mail },
    { name: 'Templates', path: '/api-docs', icon: FileCode2 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`w-64 bg-[#071A2B] text-white flex flex-col justify-between border-r border-[#22D3EE]/15 p-5 shrink-0 ${className}`}>
      
      {/* Navigation Items */}
      <div className="space-y-6">
        <div className="px-3 text-[11px] font-mono font-semibold tracking-wider text-[#94A3B8] uppercase">
          Navigation Menu
        </div>
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/30 font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={18} className="text-[#22D3EE]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status Panel */}
      <div className="bg-[#071A2B]/80 border border-[#22D3EE]/20 rounded-2xl p-4 space-y-3 shadow-inner">
        <div className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-2">
          <span>System Status</span>
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
        </div>

        <div className="space-y-2 text-xs text-[#CBD5E1]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database size={13} className="text-[#22D3EE]" />
              Database
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#22C55E]">
              <CheckCircle2 size={12} /> Connected
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Cpu size={13} className="text-[#22D3EE]" />
              Edge Function
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#22C55E]">
              <CheckCircle2 size={12} /> Online
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server size={13} className="text-[#22D3EE]" />
              Email Service
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#22C55E]">
              <CheckCircle2 size={12} /> Connected
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
