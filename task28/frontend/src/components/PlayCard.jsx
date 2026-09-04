import React from 'react';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

const PlayCard = ({ onOpenWorkflow }) => {
  return (
    <div className="glass-card rounded-3xl p-6 border border-cyber/30 bg-gradient-to-r from-midnight-card via-midnight to-electric/20 shadow-cyan-glow relative overflow-hidden group mb-8">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyber/15 rounded-full blur-3xl group-hover:bg-cyber/25 transition-all duration-500 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenWorkflow}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-electric via-cyber to-vibrant p-0.5 shadow-blue-glow group-hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 flex items-center justify-center cursor-pointer"
          >
            <div className="w-full h-full bg-midnight-dark rounded-[14px] flex items-center justify-center group-hover:bg-electric transition-colors">
              <Play className="w-7 h-7 text-cyber group-hover:text-white fill-cyber group-hover:fill-white transition-all ml-1" />
            </div>
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyber/20 text-cyber border border-cyber/30 rounded-full uppercase tracking-wider">
                Interactive Architecture Demo
              </span>
              <Sparkles className="w-4 h-4 text-vibrant" />
            </div>
            <h3 className="text-xl font-extrabold text-white">
              How FlowBoard Works
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Watch step-by-step how frontend drag events interact with Express REST API and persist directly to MongoDB.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWorkflow}
          className="flex items-center gap-2 px-5 py-3 bg-electric/20 hover:bg-electric text-cyber hover:text-white border border-cyber/40 rounded-2xl text-xs font-bold transition-all duration-300 shadow-glass shrink-0"
        >
          <span>Watch Live Flow</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PlayCard;
