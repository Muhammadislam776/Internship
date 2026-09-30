import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';

export const AppointmentAnalyticsView: React.FC = () => {
  const { appointments } = useApp();

  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
  const noShows = appointments.filter((a) => a.status === 'no_show').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const hourlyData = [
    { hour: '08:00', count: 3, capacity: 4 },
    { hour: '09:00', count: 7, capacity: 8 },
    { hour: '10:00', count: 9, capacity: 10 },
    { hour: '11:00', count: 8, capacity: 10 },
    { hour: '12:00', count: 4, capacity: 6 },
    { hour: '14:00', count: 8, capacity: 8 },
    { hour: '15:00', count: 7, capacity: 8 },
    { hour: '16:00', count: 5, capacity: 6 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Front Desk Operational Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational appointment throughput, patient punctuality, and wait time performance
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-xl">
          Reporting Period: Today
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Visits</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{completed}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{completionRate}% fulfillment rate</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Wait Time</span>
          <div className="text-2xl font-black text-blue-600 mt-1">11.4 min</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Under NHS 15m threshold</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On-Time Arrival Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-1">91%</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">+4% improvement with SMS</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cancellations</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{cancelled}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Re-allocated to waitlist</p>
        </div>
      </div>

      {/* Hourly Clinic Traffic Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Hourly Clinic Traffic & Capacity</h2>
          <span className="text-xs text-slate-400">Peak hours: 10:00 – 11:30</span>
        </div>

        <div className="space-y-3">
          {hourlyData.map((h) => {
            const pct = Math.round((h.count / h.capacity) * 100);
            return (
              <div key={h.hour} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700">{h.hour}</span>
                  <span className="font-semibold text-slate-600">
                    {h.count} / {h.capacity} visits ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 90 ? 'bg-orange-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
