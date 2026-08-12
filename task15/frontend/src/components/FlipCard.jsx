import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

export const FlipCard = ({ front, back, className = '', height = 'h-44' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card-container cursor-pointer group ${height} ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* FRONT */}
        <div className="flip-card-back-or-front flip-card-front glass-panel rounded-2xl p-5 border border-[#22D3EE]/20 hover:border-[#22D3EE]/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#2563EB]/20 rounded-full blur-2xl pointer-events-none" />
          
          <button 
            type="button"
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-[#22D3EE]/20 text-[#9FB0C2] hover:text-[#22D3EE] transition-all opacity-70 group-hover:opacity-100"
            title="Flip card for details"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          
          {front}
        </div>

        {/* BACK */}
        <div className="flip-card-back glass-panel rounded-2xl p-5 border border-[#FF7A18]/40 bg-[#0B253A]/95 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle orange accent glow */}
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#FF7A18]/20 rounded-full blur-2xl pointer-events-none" />

          <button 
            type="button"
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-[#FF7A18]/30 text-[#FFB86B] transition-all"
            title="Flip back"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
          >
            <RotateCw className="w-3.5 h-3.5 rotate-180" />
          </button>

          {back}
        </div>
      </div>
    </div>
  );
};
