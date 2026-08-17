import React from 'react';
import { Zap, Clock, Cpu, Server, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LatencyBenchmarkCard() {
  const steps = [
    { name: '1. PostgreSQL DB Insert', latency: '24 ms', pct: 15, color: '#2563EB' },
    { name: '2. Database Webhook Trigger', latency: '42 ms', pct: 25, color: '#22D3EE' },
    { name: '3. Supabase Deno Edge Function', latency: '180 ms', pct: 60, color: '#FF7A18' },
    { name: '4. Resend Transactional Email API', latency: '210 ms', pct: 75, color: '#22C55E' }
  ];

  return (
    <div className="glass-card-dark rounded-3xl p-6 lg:p-8 border border-[#22D3EE]/30 relative overflow-hidden bg-dark-grid">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#FF7A18] animate-pulse" />
            <h3 className="font-heading text-lg font-bold text-white">Sub-Second Execution Latency Breakdown</h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            End-to-end benchmark from database event insertion to transactional inbox receipt
          </p>
        </div>

        <div className="bg-[#22C55E]/15 border border-[#22C55E]/40 px-4 py-2 rounded-2xl text-xs font-mono font-bold text-[#22C55E] flex items-center gap-2">
          <Clock size={15} />
          Total Time: 456 ms
        </div>
      </div>

      {/* Latency Bars */}
      <div className="space-y-4">
        {steps.map((item) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-white font-heading">{item.name}</span>
              <span className="font-mono text-[#22D3EE] font-bold">{item.latency}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#071A2B] border border-white/10 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-1000 shadow-md"
                style={{ width: `${item.pct}%`, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
        <span>Zero cold-start bottleneck</span>
        <span className="text-[#22D3EE] font-bold">99.99% Global Delivery Reliability</span>
      </div>
    </div>
  );
}
