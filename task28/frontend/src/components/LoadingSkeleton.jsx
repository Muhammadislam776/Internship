import React from 'react';

export const TaskSkeleton = () => (
  <div className="glass-card rounded-2xl p-4 border border-cyber/10 animate-pulse space-y-3">
    <div className="flex justify-between items-center">
      <div className="w-16 h-4 bg-slate-800 rounded-md" />
      <div className="w-6 h-6 bg-slate-800 rounded-full" />
    </div>
    <div className="w-3/4 h-5 bg-slate-700 rounded-md" />
    <div className="w-full h-3 bg-slate-800 rounded-md" />
    <div className="w-1/2 h-3 bg-slate-800 rounded-md" />
    <div className="flex justify-between items-center pt-2 border-t border-white/5">
      <div className="w-20 h-4 bg-slate-800 rounded-md" />
      <div className="w-6 h-6 bg-slate-700 rounded-full" />
    </div>
  </div>
);

export const ProjectSkeleton = () => (
  <div className="glass-card rounded-3xl overflow-hidden border border-cyber/10 animate-pulse h-80 flex flex-col justify-between">
    <div className="w-full h-40 bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="w-1/2 h-6 bg-slate-700 rounded-md" />
      <div className="w-full h-3 bg-slate-800 rounded-md" />
      <div className="w-full h-2 bg-slate-800 rounded-full mt-4" />
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="glass-card rounded-2xl p-5 border border-cyber/10 animate-pulse h-40 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="w-24 h-4 bg-slate-800 rounded" />
          <div className="w-8 h-8 bg-slate-800 rounded-xl" />
        </div>
        <div className="w-16 h-8 bg-slate-700 rounded" />
        <div className="w-full h-2 bg-slate-800 rounded-full" />
      </div>
    ))}
  </div>
);
