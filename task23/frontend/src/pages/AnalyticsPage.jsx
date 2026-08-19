import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, MapPin, Tag, PieChart as PieIcon, Layers } from 'lucide-react';
import { fetchAnalytics } from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics().then(res => {
      setAnalytics(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching analytics:', err);
      setLoading(false);
    });
  }, []);

  const statusColors = {
    Delivered: '#10B981',
    Shipped: '#06B6D4',
    Processing: '#3B82F6',
    Pending: '#F59E0B',
    Cancelled: '#F43F5E'
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white">Order Intelligence Analytics</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40 text-xs font-mono font-bold">
            Real-time Aggregations
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Visual revenue trends, product category breakdowns, order statuses, and geographical distribution
        </p>
      </div>

      {/* Row 1: Revenue Over Time & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Orders Over Time */}
        <div className="p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Revenue Trajectory</h3>
              <p className="text-xs text-slate-400">Monthly aggregate revenue across all joined orders</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              +$284.9k Total
            </span>
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="w-full h-full bg-slate-800/40 skeleton-shimmer rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.timeline || []}>
                  <defs>
                    <linearGradient id="analyticsRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month_label" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#analyticsRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue by Category (Bar Chart) */}
        <div className="p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="font-bold text-white text-base">Orders & Revenue by Category</h3>
            <p className="text-xs text-slate-400">Sales volume performance per product category</p>
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="w-full h-full bg-slate-800/40 skeleton-shimmer rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.categoryBreakdown || []}>
                  <XAxis dataKey="category" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="revenue" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Status Breakdown & Geographical Customer Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Status Share</h3>
            <p className="text-xs text-slate-400 mb-4">Percentage breakdown of order statuses</p>

            <div className="h-52 w-full flex items-center justify-center">
              {loading ? (
                <div className="w-36 h-36 rounded-full bg-slate-800/40 skeleton-shimmer" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.statusBreakdown || []}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {(analytics?.statusBreakdown || []).map((entry) => (
                        <Cell key={entry.status} fill={statusColors[entry.status] || '#8B5CF6'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
            {(analytics?.statusBreakdown || []).map(st => (
              <div key={st.status} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[st.status] || '#8B5CF6' }} />
                <span className="text-slate-300 truncate">{st.status}: <strong className="text-white font-mono">{st.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Geographical Locations */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Top Customer Locations</h3>
              <p className="text-xs text-slate-400">Order density and spend aggregated by city & country</p>
            </div>
            <MapPin className="w-5 h-5 text-indigo-400" />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-800/40 skeleton-shimmer rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(analytics?.locationBreakdown || []).map((loc, idx) => {
                const maxSpend = analytics?.locationBreakdown[0]?.total_spent || 1;
                const percentage = Math.round((loc.total_spent / maxSpend) * 100);

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{loc.city}, {loc.country}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-indigo-300 font-mono">
                          {loc.customer_count} Customers
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        ${parseFloat(loc.total_spent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
