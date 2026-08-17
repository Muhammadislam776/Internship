import React from 'react';
import { Database, Zap, Cpu, Mail, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function EventVisualizer({ currentStage = 'IDLE', activeEvent = null }) {
  // Stages: IDLE | INSERT | TRIGGER_DETECTED | EDGE_FUNCTION | DELIVERED | FAILED

  const stages = [
    { id: 'INSERT', label: 'Database Insert', icon: Database, desc: 'Record inserted into Supabase DB' },
    { id: 'TRIGGER_DETECTED', label: 'Event Trigger', icon: Zap, desc: 'PostgreSQL DB Webhook fired' },
    { id: 'EDGE_FUNCTION', label: 'Edge Function', icon: Cpu, desc: 'Supabase Deno TypeScript runtime' },
    { id: 'DELIVERED', label: 'Email API', icon: Mail, desc: 'Transactional email sent' },
    { id: 'FINISHED', label: 'Status Updated', icon: CheckCircle2, desc: 'Delivery tracked in dashboard' }
  ];

  const getStageStatus = (stageId) => {
    if (currentStage === 'IDLE') return 'idle';
    if (currentStage === 'FAILED' && (stageId === 'DELIVERED' || stageId === 'FINISHED')) return 'error';

    const stageOrder = ['INSERT', 'TRIGGER_DETECTED', 'EDGE_FUNCTION', 'DELIVERED', 'FINISHED'];
    const currentIndex = stageOrder.indexOf(currentStage === 'FAILED' ? 'EDGE_FUNCTION' : currentStage);
    const stageIndex = stageOrder.indexOf(stageId);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'idle';
  };

  return (
    <div className="glass-card-dark rounded-3xl p-6 lg:p-8 border border-[#22D3EE]/30 relative overflow-hidden bg-dark-grid">
      
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#22D3EE]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] animate-ping"></span>
            <h3 className="font-heading text-xl font-bold text-white">Live Event Pipeline</h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time visual monitoring of PostgreSQL DB events triggering Deno Edge Functions
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          {activeEvent ? (
            <div className="bg-[#071A2B] border border-[#2563EB]/40 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <span className="text-[#94A3B8]">Active Event:</span>
              <span className="font-mono text-[#22D3EE] font-bold">{activeEvent.id}</span>
              <span className="text-white font-semibold">({activeEvent.event_type || 'New Event'})</span>
            </div>
          ) : (
            <div className="bg-[#071A2B] border border-white/10 px-4 py-2 rounded-xl text-xs text-[#94A3B8] font-mono">
              Status: <span className="text-[#22D3EE] font-semibold">Monitoring Events...</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Node Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const status = getStageStatus(stage.id);

          let nodeBg = 'bg-[#071A2B] border-white/10 text-[#94A3B8]';
          let iconColor = 'text-[#94A3B8]';

          if (status === 'completed') {
            nodeBg = 'bg-[#22C55E]/10 border-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20';
            iconColor = 'text-[#22C55E]';
          } else if (status === 'active') {
            nodeBg = 'bg-[#FF7A18]/20 border-[#FF7A18] text-white shadow-xl shadow-[#FF7A18]/40 animate-pulse-orange';
            iconColor = 'text-[#FF7A18]';
          } else if (status === 'error') {
            nodeBg = 'bg-[#EF4444]/20 border-[#EF4444] text-white shadow-xl shadow-[#EF4444]/40';
            iconColor = 'text-[#EF4444]';
          }

          return (
            <div key={stage.id} className="relative flex flex-col items-center text-center group">
              
              {/* Node Circle */}
              <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 mb-3 ${nodeBg}`}>
                <Icon size={26} className={iconColor} />
              </div>

              {/* Node Title & Description */}
              <div className="text-xs font-heading font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                {stage.label}
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2 px-1">
                {stage.desc}
              </div>

              {/* Connecting Arrow for Desktop */}
              {idx < stages.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-[2px] z-0">
                  <div className={`h-full w-full transition-all duration-500 ${
                    status === 'completed'
                      ? 'bg-gradient-to-r from-[#22C55E] to-[#2563EB]'
                      : status === 'active'
                      ? 'bg-gradient-to-r from-[#FF7A18] to-[#22D3EE] animate-pulse'
                      : 'bg-white/10'
                  }`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Execution Summary Footer */}
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span> Database Trigger</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></span> Edge Function</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF7A18]"></span> Email API</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span> Sent Success</span>
        </div>
        <div className="font-mono text-[#22D3EE]">
          Edge Function Secret: <span className="text-white">Protected Server-Side</span>
        </div>
      </div>
    </div>
  );
}
