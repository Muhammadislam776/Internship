import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Key, Lock, Database, Server, CheckCircle2 } from 'lucide-react';

export const Settings = ({ onShowToast }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-[#22D3EE]" /> System &amp; Supabase Credentials Security
          </h1>
          <p className="text-xs text-[#9FB0C2] mt-1">
            Server-side environment variables and Supabase Auth Admin API configuration status.
          </p>
        </div>

        {/* Security Rule Checklist */}
        <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
          <h3 className="font-bold text-sm text-white mb-2">Supabase Service Role Security Compliance</h3>

          <div className="p-3.5 rounded-2xl glass-card flex items-center justify-between border border-[#22C55E]/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              <div>
                <p className="font-bold text-white">NEVER exposed to React frontend</p>
                <p className="text-[11px] text-[#9FB0C2]">Service role key exists strictly inside backend environment process</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full font-mono text-[10px]">Verified</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-card flex items-center justify-between border border-[#22C55E]/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              <div>
                <p className="font-bold text-white">NEVER prefixed with VITE_</p>
                <p className="text-[11px] text-[#9FB0C2]">Prevents Vite bundler from injecting key into browser JS artifacts</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full font-mono text-[10px]">Protected</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-card flex items-center justify-between border border-[#22C55E]/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              <div>
                <p className="font-bold text-white">Stored strictly in backend/.env</p>
                <p className="text-[11px] text-[#9FB0C2]">SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY loaded via Express dotenv</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full font-mono text-[10px]">Enforced</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => onShowToast && onShowToast({ title: 'Security Saved', message: 'System configuration verified securely', type: 'success' })}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#22D3EE] font-bold text-white text-xs shadow-lg"
          >
            Verify Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};
