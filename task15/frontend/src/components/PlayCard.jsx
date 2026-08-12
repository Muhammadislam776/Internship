import React, { useState, useEffect } from 'react';
import { Play, Pause, X, CheckCircle2, UserCheck, Shield, Key, Sparkles, RefreshCw } from 'lucide-react';

export const PlayCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const timelineEvents = [
    { title: 'User Registered', desc: 'Auth account created via Supabase Provider', time: '10:00:01 AM', icon: UserCheck, color: 'text-[#22D3EE]' },
    { title: 'Profile Updated', desc: 'Metadata & avatar synced to system store', time: '10:00:15 AM', icon: Sparkles, color: 'text-[#FFB86B]' },
    { title: 'Email Verified', desc: 'Confirmation magic link authenticated', time: '10:01:04 AM', icon: CheckCircle2, color: 'text-[#22C55E]' },
    { title: 'Admin Login', desc: 'Server-side Service Role token issued', time: '10:02:10 AM', icon: Key, color: 'text-[#2563EB]' },
    { title: 'Settings Updated', desc: '2FA security & RBAC permissions assigned', time: '10:04:30 AM', icon: Shield, color: 'text-purple-400' }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying && modalOpen) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= timelineEvents.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, modalOpen, timelineEvents.length]);

  const handleOpenModal = () => {
    setModalOpen(true);
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <>
      {/* Play Card */}
      <div 
        onClick={handleOpenModal}
        className="relative glass-panel rounded-3xl overflow-hidden border border-[#22D3EE]/30 group cursor-pointer h-52 flex flex-col justify-between p-6 shadow-2xl transition-all duration-300 hover:border-[#22D3EE] hover:shadow-cyan-glow"
      >
        {/* Background Visual Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500 scale-105 group-hover:scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-[#071A2B]/60 to-transparent" />

        {/* Card Header Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#071A2B]/80 text-[#22D3EE] text-[10px] font-mono border border-[#22D3EE]/40">
            SIMULATED REPLAY
          </span>
          <span className="text-xs text-[#FFB86B] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Play
          </span>
        </div>

        {/* Center Play Button Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-14 h-14 rounded-full bg-[#2563EB]/80 text-white flex items-center justify-center shadow-xl shadow-[#2563EB]/50 border border-[#22D3EE] group-hover:scale-115 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white translate-x-0.5 text-white" />
          </div>
          <h3 className="text-base font-bold text-white mt-3 group-hover:text-[#22D3EE] transition-colors">
            User Activity Preview
          </h3>
          <p className="text-xs text-[#9FB0C2] mt-0.5">Click to launch animated timeline sequence</p>
        </div>
      </div>

      {/* Timeline Modal Player */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative glass-panel rounded-3xl p-6 border border-[#22D3EE]/40 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#22D3EE]" />
                <h3 className="font-bold text-sm text-white">Live User Lifecycle Simulation</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10 mb-6 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#2563EB]/80"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => {
                    setActiveStep(0);
                    setIsPlaying(true);
                  }}
                  className="p-2 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white"
                  title="Restart Simulation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <span className="font-mono text-[11px] text-[#22D3EE]">
                Step {activeStep + 1} of {timelineEvents.length}
              </span>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
              {timelineEvents.map((evt, idx) => {
                const Icon = evt.icon;
                const isPassed = idx <= activeStep;
                const isCurrent = idx === activeStep;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-4 transition-all duration-300 ${
                      isPassed ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <div 
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent 
                          ? 'bg-[#2563EB] border-[#22D3EE] scale-110 shadow-lg shadow-[#22D3EE]/40' 
                          : isPassed 
                            ? 'bg-[#0B253A] border-[#22C55E] text-[#22C55E]' 
                            : 'bg-[#071A2B] border-white/20 text-[#9FB0C2]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className={`p-3 rounded-2xl glass-card flex-1 ${isCurrent ? 'border-[#22D3EE]/60 bg-white/10' : ''}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-white">{evt.title}</h4>
                        <span className="font-mono text-[10px] text-[#9FB0C2]">{evt.time}</span>
                      </div>
                      <p className="text-[11px] text-[#9FB0C2] mt-0.5">{evt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0B253A] text-xs font-bold text-white border border-[#22D3EE]/40 hover:scale-105 transition-transform"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
