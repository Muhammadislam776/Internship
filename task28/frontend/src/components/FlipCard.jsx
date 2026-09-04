import React, { useState } from 'react';

const FlipCard = ({ frontTitle, frontValue, frontSubtitle, backTitle, backValue, backSubtitle, icon: Icon, badgeColor = 'electric' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 w-full h-40 cursor-pointer group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 backface-hidden glass-card rounded-2xl p-5 flex flex-col justify-between border border-cyber/20 shadow-glass group-hover:border-cyber/50 group-hover:shadow-cyan-glow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              {frontTitle}
            </span>
            {Icon && (
              <div className="p-2.5 rounded-xl bg-electric/10 border border-electric/20 text-cyber group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-cyber" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {frontValue}
            </h3>
            {frontSubtitle && (
              <p className="text-xs text-slate-400 mt-1">{frontSubtitle}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-cyber font-semibold">
            <span>Hover / Tap for details</span>
            <span>⇄</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card rounded-2xl p-5 flex flex-col justify-between border border-vibrant/30 bg-gradient-to-br from-midnight via-midnight-card to-electric/20 shadow-orange-glow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-vibrant uppercase">
              {backTitle || 'Breakdown'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-vibrant/20 text-vibrant border border-vibrant/30">
              Live Stat
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {backValue}
            </h3>
            {backSubtitle && (
              <p className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
                {backSubtitle}
              </p>
            )}
          </div>

          <p className="text-[10px] text-slate-400">
            Flipped view • Real-time backend metrics
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
