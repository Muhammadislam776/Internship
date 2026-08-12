import React from 'react';

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div 
          key={idx} 
          className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4 animate-shimmer border border-white/5"
        >
          <div className="flex items-center gap-3 w-1/4">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 bg-white/15 rounded w-3/4" />
              <div className="h-2.5 bg-white/10 rounded w-1/2" />
            </div>
          </div>
          <div className="h-3.5 bg-white/10 rounded w-1/5 hidden md:block" />
          <div className="h-6 bg-white/10 rounded-full w-16" />
          <div className="h-6 bg-white/10 rounded-full w-20 hidden lg:block" />
          <div className="h-3.5 bg-white/10 rounded w-24 hidden xl:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="w-8 h-8 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
};
