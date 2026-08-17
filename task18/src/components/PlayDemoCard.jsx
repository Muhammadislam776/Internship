import React, { useState, useEffect } from 'react';
import { Play, X, ChevronRight, ChevronLeft, Database, Zap, Cpu, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PlayDemoCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Step 1: Database Insert',
      icon: Database,
      color: '#2563EB',
      heading: 'User Submits Data → PostgreSQL INSERT',
      desc: 'When a customer registers, makes a hotel booking, or submits a payment, a new record is created in the Supabase PostgreSQL notifications table.',
      tech: 'Table: public.notifications (RLS enabled)'
    },
    {
      num: 2,
      title: 'Step 2: Event Trigger',
      icon: Zap,
      color: '#22D3EE',
      heading: 'PostgreSQL Database Webhook Fired',
      desc: 'A database trigger monitors row creation and automatically fires a Webhook request containing the full JSON event payload.',
      tech: 'Trigger: AFTER INSERT ON public.notifications'
    },
    {
      num: 3,
      title: 'Step 3: Edge Function',
      icon: Cpu,
      color: '#FF7A18',
      heading: 'Supabase Edge Function Processing',
      desc: 'The Deno TypeScript function securely receives the payload server-side. It validates email parameters and compiles the HTML template without exposing secret credentials to the client.',
      tech: 'Runtime: Deno TypeScript (CORS & Secrets Protection)'
    },
    {
      num: 4,
      title: 'Step 4: Email Provider',
      icon: Mail,
      color: '#2563EB',
      heading: 'Transactional Email API Dispatch',
      desc: 'The Edge Function invokes the external email service (Resend / SendGrid API) using a server-side API key stored securely in environment secrets.',
      tech: 'Provider: Resend API (Bearer Auth Header)'
    },
    {
      num: 5,
      title: 'Step 5: Email Delivered',
      icon: CheckCircle2,
      color: '#22C55E',
      heading: 'Status Updated & Real-time Sync',
      desc: 'The Edge Function updates the database record status to SENT (or FAILED with diagnostic error log). The frontend dashboard reflects the delivery in real-time.',
      tech: 'Realtime: Supabase Realtime channel event broadcast'
    }
  ];

  useEffect(() => {
    let timer;
    if (modalOpen && autoPlay) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [modalOpen, autoPlay]);

  return (
    <>
      {/* Large Demo Card */}
      <div className="glass-card-dark rounded-3xl p-8 border border-[#22D3EE]/30 relative overflow-hidden bg-dark-grid shadow-2xl group hover:border-[#22D3EE]/60 transition-all">
        
        {/* Glowing Orbs */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#FF7A18]/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-xs font-mono font-bold">
              <Zap size={13} />
              INTERACTIVE DEMONSTRATION
            </div>
            <h3 className="font-heading text-2xl font-extrabold text-white">
              How NotifyFlow Works Under The Hood
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Watch an interactive 5-stage animated walkthrough of our event-driven serverless architecture from DB insert to inbox delivery.
            </p>
          </div>

          {/* Large Circular Play Button */}
          <button
            onClick={() => { setModalOpen(true); setCurrentStep(0); setAutoPlay(true); }}
            className="self-start md:self-center shrink-0 w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF7A18] to-[#2563EB] p-1 shadow-2xl shadow-[#FF7A18]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group/btn"
            title="Play Interactive Workflow Demo"
          >
            <div className="w-full h-full rounded-full bg-[#071A2B] flex items-center justify-center text-white group-hover/btn:bg-transparent transition-colors">
              <Play size={32} className="text-[#FF7A18] group-hover/btn:text-white fill-current translate-x-0.5 transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Modal Interactive Stepper */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071A2B]/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="glass-card-dark w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/40 shadow-2xl relative overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-[#94A3B8] hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Stepper Progress Header */}
            <div className="mb-8">
              <div className="text-xs font-mono font-bold text-[#22D3EE] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Architecture Walkthrough &bull; Stage {currentStep + 1} of 5</span>
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className="text-[11px] underline text-[#94A3B8] hover:text-white"
                >
                  {autoPlay ? 'Pause Auto-Play' : 'Resume Auto-Play'}
                </button>
              </div>

              {/* Progress Step Pills */}
              <div className="grid grid-cols-5 gap-2">
                {steps.map((s, idx) => (
                  <button
                    key={s.num}
                    onClick={() => { setCurrentStep(idx); setAutoPlay(false); }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'bg-[#FF7A18] shadow-lg shadow-[#FF7A18]/50'
                        : idx < currentStep
                        ? 'bg-[#22C55E]'
                        : 'bg-white/10'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Step Body */}
            {(() => {
              const active = steps[currentStep];
              const ActiveIcon = active.icon;

              return (
                <div className="py-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
                      style={{ backgroundColor: `${active.color}20`, border: `2px solid ${active.color}` }}
                    >
                      <ActiveIcon size={32} style={{ color: active.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#94A3B8] uppercase">{active.title}</div>
                      <h4 className="font-heading text-xl font-bold text-white mt-0.5">{active.heading}</h4>
                    </div>
                  </div>

                  <p className="text-sm text-[#CBD5E1] leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/10">
                    {active.desc}
                  </p>

                  <div className="bg-[#071A2B] p-4 rounded-xl border border-[#22D3EE]/20 font-mono text-xs text-[#22D3EE]">
                    <span className="text-[#94A3B8] mr-2">Technical Specification:</span>
                    {active.tech}
                  </div>
                </div>
              );
            })()}

            {/* Stepper Navigation Controls */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                disabled={currentStep === 0}
                onClick={() => { setCurrentStep(prev => prev - 1); setAutoPlay(false); }}
                className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Previous Step
              </button>

              <button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    setModalOpen(false);
                  }
                  setAutoPlay(false);
                }}
                className="btn-primary text-xs"
              >
                {currentStep === steps.length - 1 ? 'Finish Tour' : 'Next Step'} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
