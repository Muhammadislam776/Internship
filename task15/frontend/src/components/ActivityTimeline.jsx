import React from 'react';
import { History, UserPlus, CheckCircle2, Key, UserCheck, ShieldAlert, Clock } from 'lucide-react';

export const ActivityTimeline = () => {
  const events = [
    { title: 'New user registered', user: 'Dr. Evelyn Vance', time: '2 mins ago', icon: UserPlus, color: 'text-[#22D3EE]', bg: 'bg-[#22D3EE]/20' },
    { title: 'User verified email', user: 'Sarah Jenkins', time: '14 mins ago', icon: CheckCircle2, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/20' },
    { title: 'Admin login session', user: 'Alex Vance (Service Role)', time: '45 mins ago', icon: Key, color: 'text-[#FF7A18]', bg: 'bg-[#FF7A18]/20' },
    { title: 'Profile metadata updated', user: 'Marcus Sterling', time: '1 hour ago', icon: UserCheck, color: 'text-[#2563EB]', bg: 'bg-[#2563EB]/20' },
    { title: 'New role assigned', user: 'Aria Montgomery -> Admin', time: '3 hours ago', icon: ShieldAlert, color: 'text-purple-400', bg: 'bg-purple-500/20' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 mb-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <History className="w-4 h-4 text-[#FF7A18]" /> Live Audit &amp; Activity Timeline
        </h3>
        <span className="text-xs font-mono text-[#22D3EE]">Real-time Event Stream</span>
      </div>

      <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {events.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div key={idx} className="flex items-start gap-4 relative z-10 group">
              <div className={`w-8 h-8 rounded-full ${evt.bg} ${evt.color} flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 p-3 rounded-2xl glass-card border border-white/5 group-hover:border-[#22D3EE]/40 transition-all flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-white">{evt.title}</h4>
                  <p className="text-[11px] text-[#9FB0C2] font-mono mt-0.5">{evt.user}</p>
                </div>
                <span className="text-[10px] text-[#9FB0C2] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#22D3EE]" /> {evt.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
