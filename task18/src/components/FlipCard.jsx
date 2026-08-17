import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

export default function FlipCard({ frontTitle, frontValue, frontSub, backTitle, backValue, backDesc, accentColor = 'blue' }) {
  const [flipped, setFlipped] = useState(false);

  const getGlowClass = () => {
    switch (accentColor) {
      case 'cyan': return 'hover:shadow-[#22D3EE]/30';
      case 'orange': return 'hover:shadow-[#FF7A18]/30';
      case 'green': return 'hover:shadow-[#22C55E]/30';
      default: return 'hover:shadow-[#2563EB]/30';
    }
  };

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={`flip-card-container ${flipped ? 'is-flipped' : ''} ${getGlowClass()}`}
      title="Click or hover to flip card"
    >
      <div className="flip-card-inner">
        
        {/* FRONT SIDE */}
        <div className="flip-card-front">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase tracking-wider">
              {frontTitle}
            </span>
            <RotateCw size={14} className="text-[#94A3B8] opacity-60" />
          </div>
          <div className="my-auto">
            <div className="font-heading text-3xl font-extrabold text-[#071A2B] tracking-tight">
              {frontValue}
            </div>
            {frontSub && (
              <div className="text-xs font-semibold text-[#2563EB] mt-1">
                {frontSub}
              </div>
            )}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            Hover / Click to Flip 3D
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="flip-card-back">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#22D3EE] uppercase tracking-wider">
              {backTitle}
            </span>
            <span className="text-[10px] bg-[#22D3EE]/20 text-[#22D3EE] font-mono px-2 py-0.5 rounded-full">
              LIVE STATS
            </span>
          </div>
          <div className="my-auto">
            <div className="font-heading text-2xl font-extrabold text-white">
              {backValue}
            </div>
            <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
              {backDesc}
            </p>
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            Click to return front
          </div>
        </div>

      </div>
    </div>
  );
}
