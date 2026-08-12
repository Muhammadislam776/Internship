import React from 'react';
import { Zap, ShieldCheck, Server, Lock, ExternalLink, Heart, Globe } from 'lucide-react';

export const Footer = ({ apiHealth }) => {
  return (
    <footer className="mt-16 border-t border-white/10 glass-panel bg-[#071A2B]/90 text-xs text-[#9FB0C2] relative overflow-hidden">
      {/* Background Decorative Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#22D3EE]/20 border border-white/20">
                <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#22D3EE] to-[#FFB86B]">
                  AdminSphere
                </span>
                <span className="ml-2 px-2 py-0.5 text-[9px] font-bold bg-[#2563EB]/30 text-[#22D3EE] rounded-full border border-[#22D3EE]/30">
                  v2.4 PRO
                </span>
              </div>
            </div>
            <p className="text-xs text-[#9FB0C2] leading-relaxed max-w-sm">
              Complete Control. One Intelligent Dashboard. Next-generation enterprise admin portal powered by server-side Supabase Auth Admin API and Express security nodes.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-[#22C55E]">
                <ShieldCheck className="w-4 h-4" />
                <span>SOC2 Compliant</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1.5 text-[#22D3EE]">
                <Lock className="w-4 h-4" />
                <span>256-Bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#users" className="hover:text-[#22D3EE] transition-colors">User Management</a></li>
              <li><a href="#roles" className="hover:text-[#22D3EE] transition-colors">RBAC Roles & Permissions</a></li>
              <li><a href="#analytics" className="hover:text-[#22D3EE] transition-colors">Telemetry Analytics</a></li>
              <li><a href="#reports" className="hover:text-[#22D3EE] transition-colors">Exportable Reports</a></li>
            </ul>
          </div>

          {/* Col 3: Security & API */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Security & API</h4>
            <ul className="space-y-2">
              <li><span className="text-[#22C55E]">Supabase Server Auth</span></li>
              <li><span className="text-white/80">Service Role Protection</span></li>
              <li><span className="text-white/80">Express Node Gateway</span></li>
              <li><span className="text-white/80">Audit Log Stream</span></li>
            </ul>
          </div>

          {/* Col 4: Telemetry Card */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Server Status</h4>
            <div className="p-3.5 rounded-2xl glass-card border border-[#22D3EE]/30 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9FB0C2]">Backend Node</span>
                <span className="text-[#22C55E] font-bold font-mono">● Online</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9FB0C2]">API Endpoint</span>
                <span className="text-[#22D3EE] font-mono">/admin/users</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9FB0C2]">Latency</span>
                <span className="text-white font-mono">{apiHealth?.responseTime || 14}ms</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9FB0C2]">
            © 2026 AdminSphere Enterprise Systems. Built for high-security cloud operations.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#22D3EE]">Express API Port: 5000</span>
            <span className="text-white/20">•</span>
            <span className="text-[#FFB86B]">Vite Frontend Port: 3000</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
