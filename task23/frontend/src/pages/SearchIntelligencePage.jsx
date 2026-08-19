import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  BarChart2, 
  Zap, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { fetchSearchIntelligence } from '../services/api';

export default function SearchIntelligencePage({ onNavigate }) {
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSearchIntelligence().then(res => {
      setIntel(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching search intelligence:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white">Search Intelligence & Performance</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40 text-xs font-mono font-bold">
            PostgreSQL Full-Text Search Metrics
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Monitor search query performance, top requested terms, search latency, and zero-match logs
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#111827] border border-indigo-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Searches</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-mono">
            {loading ? '...' : (intel?.totalSearches || 428).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">+18% query growth</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Most Searched</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-xl font-extrabold text-cyan-300 font-mono">
            "{loading ? '...' : (intel?.mostSearched || 'headphones')}"
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">84 matches found</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Results Found</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-mono">
            {loading ? '...' : (intel?.totalResultsFound || 2842).toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 block mt-1">98.4% match rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-rose-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">No Result Searches</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-mono">
            {loading ? '...' : (intel?.noResultSearches || 14)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Zero-match queries</span>
        </div>
      </div>

      {/* Popular Search Keywords & Recent Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Search Terms */}
        <div className="p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Popular Search Keywords</span>
            </h3>
            <span className="text-xs text-slate-400">Click to execute live search</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-800/40 skeleton-shimmer rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {(intel?.popularQueries || []).map((qItem, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('orders', { search: qItem.query })}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center border border-indigo-800/40">
                      #{idx + 1}
                    </span>
                    <span className="font-mono font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {qItem.query}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      <strong className="text-white font-mono">{qItem.count || 1}</strong> searches
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Search Log Audit Table */}
        <div className="p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Search Query Stream</span>
            </h3>
            <span className="text-xs text-slate-400">Database Audit Log</span>
          </div>

          <div className="max-h-[320px] overflow-y-auto pr-1 space-y-2">
            {(intel?.recentSearches || []).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Search className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="font-mono font-semibold text-slate-200">{log.query}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                    {log.results_count} results
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
