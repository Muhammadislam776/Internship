import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AnalyticsCharts from '../components/AnalyticsCharts';
import LatencyBenchmarkCard from '../components/LatencyBenchmarkCard';
import { eventEngine } from '../services/eventEngine';
import { BarChart3, TrendingUp, Zap, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Analytics() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    setEvents(eventEngine.getEvents());
    setStats(eventEngine.getAnalytics());
    const unsubscribe = eventEngine.subscribe((updated) => {
      setEvents(updated);
      setStats(eventEngine.getAnalytics());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex pt-16">
      <Sidebar className="hidden lg:flex" />

      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-[#2563EB]" />
            <h1 className="font-heading text-2xl font-extrabold text-[#071A2B]">Analytics Dashboard</h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Performance metrics, latency breakdowns, and delivery rate analytics
          </p>
        </div>

        {/* Top Animated Metric Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Total Events</div>
            <div className="font-heading text-2xl font-extrabold text-[#071A2B]">{stats.total || 0}</div>
            <div className="text-[10px] text-[#2563EB] font-semibold">PostgreSQL Webhooks</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Emails Sent</div>
            <div className="font-heading text-2xl font-extrabold text-[#22C55E]">{stats.sent || 0}</div>
            <div className="text-[10px] text-[#22C55E] font-semibold">100% Delivered</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Emails Failed</div>
            <div className="font-heading text-2xl font-extrabold text-[#EF4444]">{stats.failed || 0}</div>
            <div className="text-[10px] text-[#EF4444] font-semibold">Diagnostic Handled</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Success Rate</div>
            <div className="font-heading text-2xl font-extrabold text-[#2563EB]">{stats.successRate || '100'}%</div>
            <div className="text-[10px] text-[#2563EB] font-semibold">Service Level Agreement</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Today's Events</div>
            <div className="font-heading text-2xl font-extrabold text-[#FF7A18]">{events.length}</div>
            <div className="text-[10px] text-[#FF7A18] font-semibold">Captured Live</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Avg Proc. Time</div>
            <div className="font-heading text-2xl font-extrabold text-[#22D3EE]">{stats.avgProcessingTime || '480 ms'}</div>
            <div className="text-[10px] text-[#22D3EE] font-semibold font-mono">Edge Execution</div>
          </div>
        </div>

        {/* Latency Benchmark */}
        <section>
          <LatencyBenchmarkCard />
        </section>

        {/* Charts Component */}
        <section>
          <AnalyticsCharts events={events} />
        </section>

      </main>
    </div>
  );
}
