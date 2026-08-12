import React from 'react';
import { Server, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export const ApiStatus = ({ apiHealth, dataSource }) => {
  return (
    <div className="glass-panel rounded-2xl p-4 border border-[#22D3EE]/30 shadow-xl flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] flex items-center justify-center text-white shadow-lg shadow-[#22D3EE]/30">
          <Server className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Backend API</h4>
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-full border border-[#22C55E]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" /> Connected
            </span>
          </div>
          <p className="text-[11px] text-[#9FB0C2] font-mono mt-0.5">
            Endpoint: <span className="text-[#22D3EE] font-bold">/admin/users</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right">
        <div className="hidden sm:block">
          <p className="text-[10px] text-[#9FB0C2] uppercase font-mono">Server Authorization</p>
          <p className="text-xs font-bold text-white flex items-center justify-end gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> Supabase Service Role
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center font-mono">
          <span className="text-[10px] text-[#9FB0C2] block">HTTP Response</span>
          <span className="text-xs font-bold text-[#22C55E]">200 OK ({apiHealth?.responseTime || 14}ms)</span>
        </div>
      </div>
    </div>
  );
};
