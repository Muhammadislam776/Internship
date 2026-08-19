import React from 'react';

export function SkeletonCards({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-32 rounded-2xl bg-slate-800/40 skeleton-shimmer border border-slate-800" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 8 }) {
  return (
    <div className="w-full bg-[#111827]/90 rounded-2xl border border-slate-800 p-4 space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-14 bg-slate-800/40 skeleton-shimmer rounded-xl" />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-[400px] rounded-2xl bg-slate-800/40 skeleton-shimmer border border-slate-800" />
      ))}
    </div>
  );
}
