import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ page, limit, totalPages, totalItems, onPageChange, onLimitChange }) {
  if (totalItems === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-slate-400">
      {/* Items Summary */}
      <div className="flex items-center gap-2">
        <span>
          Showing <strong className="text-white font-mono">{startItem}</strong>-
          <strong className="text-white font-mono">{endItem}</strong> of{' '}
          <strong className="text-white font-mono">{totalItems.toLocaleString()}</strong> orders
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-4 border-l border-slate-800 pl-4">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-[#111827] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg bg-[#111827] border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg bg-[#111827] border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="px-3 py-1 bg-indigo-950/60 border border-indigo-800/40 rounded-lg font-semibold text-indigo-300 font-mono">
          Page {page} of {totalPages}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg bg-[#111827] border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg bg-[#111827] border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
