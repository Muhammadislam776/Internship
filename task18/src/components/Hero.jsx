import React from 'react';
import { ArrowRight, Database, Zap, Cpu, Mail, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero({ onOpenDemo }) {
  const pipelineNodes = [
    { label: 'DATABASE', icon: Database, color: '#2563EB' },
    { label: 'TRIGGER', icon: Zap, color: '#22D3EE' },
    { label: 'EDGE FUNCTION', icon: Cpu, color: '#FF7A18' },
    { label: 'EMAIL API', icon: Mail, color: '#2563EB' },
    { label: 'DELIVERED', icon: CheckCircle2, color: '#22C55E' }
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-grid bg-[#071A2B] text-white overflow-hidden">
      
      {/* Background Floating Gradient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#2563EB]/25 rounded-full blur-[100px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#22D3EE]/20 rounded-full blur-[100px] pointer-events-none animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#FF7A18]/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 text-center">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#071A2B]/80 border border-[#22D3EE]/40 text-[#22D3EE] text-xs font-mono font-bold tracking-wide shadow-glow-cyan">
          <Sparkles size={14} className="animate-spin text-[#FF7A18]" />
          <span>EVERY EVENT DESERVES A NOTIFICATION</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Turn Database Events Into <span className="bg-gradient-to-r from-[#22D3EE] via-[#2563EB] to-[#FF7A18] bg-clip-text text-transparent">Instant Emails.</span>
          </h1>
          <p className="text-base sm:text-xl text-[#CBD5E1] max-w-2xl mx-auto font-normal leading-relaxed">
            NotifyFlow automatically transforms important database events into reliable, real-time email notifications powered by Supabase Edge Functions.
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto btn-orange text-base py-4 px-8 rounded-2xl font-bold tracking-wide shadow-glow-orange flex items-center justify-center gap-3 hover:scale-105 transition-all"
          >
            <span>Create Event</span>
            <ArrowRight size={18} />
          </Link>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto btn-secondary text-base py-4 px-8 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 bg-white/10 text-white hover:bg-white/20 border-white/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Play size={18} className="text-[#22D3EE] fill-current" />
            <span>View Live Demo</span>
          </button>
        </div>

        {/* Continuous Animated Pipeline Visualizer Header */}
        <div className="pt-12 max-w-5xl mx-auto">
          <div className="glass-card-dark p-6 sm:p-8 rounded-3xl border border-[#22D3EE]/30 shadow-2xl relative">
            <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-6">
              Continuous Real-Time Event Architecture Pipeline
            </div>

            {/* Pipeline Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center relative">
              {pipelineNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div key={node.label} className="flex flex-col items-center group">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg border transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${node.color}15`,
                        borderColor: `${node.color}60`,
                        boxShadow: `0 0 15px ${node.color}40`
                      }}
                    >
                      <Icon size={24} style={{ color: node.color }} />
                    </div>
                    <span className="font-heading text-xs font-extrabold text-white tracking-wider">
                      {node.label}
                    </span>

                    {/* Animated connecting flow arrow */}
                    {index < pipelineNodes.length - 1 && (
                      <div className="hidden sm:block absolute top-7 left-[calc(20%*${index}+10%)] w-12 text-[#22D3EE] opacity-60 animate-pulse">
                        &rarr;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
