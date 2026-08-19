import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, Sparkles, Filter, CheckCircle2, Clock } from 'lucide-react';

export default function GlobalSearch({ 
  searchQuery, 
  setSearchQuery, 
  onSearchSubmit, 
  totalResults, 
  isLoading,
  recentSearches = [],
  onSelectRecent
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Global Keyboard Shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const popularTags = ['headphones', 'john@example.com', 'ORD-10482', 'London', 'Delivered', 'Electronics'];

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input Box */}
      <div className={`relative flex items-center bg-[#111827]/90 border rounded-2xl transition-all duration-300 shadow-lg ${
        focused 
          ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-500/10' 
          : 'border-slate-800 hover:border-slate-700'
      }`}>
        <div className="pl-4 pr-2 text-indigo-400 flex items-center justify-center">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearchSubmit) {
              onSearchSubmit(searchQuery);
            }
          }}
          placeholder="Search orders, customers, emails, products, cities..."
          className="w-full bg-transparent py-3.5 pr-24 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        {/* Action Controls inside Search Box */}
        <div className="absolute right-3 flex items-center gap-2">
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-400">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Instant Search Status Bar when Query is active */}
      {searchQuery && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            PostgreSQL Full-Text Search across Joined Dataset:
          </span>
          <span className="font-semibold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/40">
            {totalResults !== undefined ? `${totalResults} Orders Found` : 'Searching...'}
          </span>
        </div>
      )}

      {/* Search Popover Suggestions when focused */}
      {focused && !searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#0F172A]/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 animate-slide-up">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Popular Queries</span>
            <span className="text-[10px] text-indigo-400 font-normal">Database-level FTS</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  if (onSelectRecent) onSelectRecent(tag);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-indigo-600/30 border border-slate-700/50 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Search className="w-3 h-3 text-slate-400" />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          {recentSearches && recentSearches.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(item.query)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 text-left transition-colors"
                  >
                    <span className="font-mono text-indigo-300">{item.query}</span>
                    <span className="text-[11px] text-slate-500">{item.results_count || 0} results</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
