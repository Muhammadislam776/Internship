import React from 'react';
import { BarChart3, TrendingUp, PieChart, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AnalyticsCharts({ events = [] }) {
  const total = events.length || 1;
  const sentCount = events.filter(e => e.status === 'SENT').length;
  const failedCount = events.filter(e => e.status === 'FAILED').length;

  const eventTypeCounts = events.reduce((acc, curr) => {
    acc[curr.event_type] = (acc[curr.event_type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.keys(eventTypeCounts).map(key => ({
    name: key,
    count: eventTypeCounts[key],
    percentage: Math.round((eventTypeCounts[key] / total) * 100)
  }));

  const mockTimeData = [
    { time: '08:00', count: 12 },
    { time: '10:00', count: 28 },
    { time: '12:00', count: 45 },
    { time: '14:00', count: 62 },
    { time: '16:00', count: 38 },
    { time: '18:00', count: 54 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Events Over Time Area Visual */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
              <TrendingUp size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#071A2B]">Events Volume Over Time</h4>
              <p className="text-[11px] text-[#64748B]">Real-time database webhook triggers per hour</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-full">
            +24.5% Peak
          </span>
        </div>

        {/* SVG Area Chart */}
        <div className="h-52 w-full pt-4">
          <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Background Grid */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeDasharray="4 4" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#E2E8F0" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#E2E8F0" strokeDasharray="4 4" />

            {/* Area Path */}
            <path
              d="M 0,120 Q 80,90 160,40 T 320,30 T 420,70 T 500,20 L 500,150 L 0,150 Z"
              fill="url(#blueGradient)"
            />
            {/* Line Path */}
            <path
              d="M 0,120 Q 80,90 160,40 T 320,30 T 420,70 T 500,20"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.5"
            />
            {/* Animated Cyan Glow Line */}
            <path
              d="M 0,120 Q 80,90 160,40 T 320,30 T 420,70 T 500,20"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="1.5"
            />
          </svg>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pt-2">
            {mockTimeData.map(d => <span key={d.time}>{d.time}</span>)}
          </div>
        </div>
      </div>

      {/* Chart 2: Event Types Distribution */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF7A18]/10 text-[#FF7A18] flex items-center justify-center font-bold">
              <PieChart size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#071A2B]">Notification Event Breakdown</h4>
              <p className="text-[11px] text-[#64748B]">Distribution across real-world SaaS workflows</p>
            </div>
          </div>
        </div>

        {/* Progress Breakdown Bars */}
        <div className="space-y-3.5 pt-2">
          {typeData.map((item, idx) => {
            const colors = ['#2563EB', '#22D3EE', '#FF7A18', '#22C55E', '#94A3B8'];
            const color = colors[idx % colors.length];

            return (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#071A2B]">{item.name}</span>
                  <span className="font-mono text-[#64748B]">{item.count} events ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage || 15}%`, backgroundColor: color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
