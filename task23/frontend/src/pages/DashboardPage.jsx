import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Search, 
  ArrowRight,
  Database,
  MapPin
} from 'lucide-react';
import MetricCards from '../components/MetricCards';
import OrdersTable from '../components/OrdersTable';
import GlobalSearch from '../components/GlobalSearch';
import { fetchAnalytics, fetchOrders, logSearchQuery } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage({ onSelectOrder, onSelectCustomer, onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAnalytics(),
      fetchOrders({ limit: 6, sort_by: 'date_desc' })
    ]).then(([analyticsRes, ordersRes]) => {
      setAnalytics(analyticsRes.data);
      setRecentOrders(ordersRes.data || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading dashboard data:', err);
      setLoading(false);
    });
  }, []);

  const handleGlobalSearchSubmit = (query) => {
    if (!query) return;
    logSearchQuery(query);
    onNavigate('orders', { search: query });
  };

  const statusColors = {
    Delivered: '#10B981',
    Shipped: '#06B6D4',
    Processing: '#3B82F6',
    Pending: '#F59E0B',
    Cancelled: '#F43F5E'
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#111827] to-slate-900 border border-indigo-500/20 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>SQL JOIN + PostgreSQL Full-Text Search Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Customer Order Intelligence
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connect every customer relationship with order history through one unified relational data experience. Powered by database-level full-text search across 1,600+ joined records.
          </p>

          {/* Integrated Global Search in Hero */}
          <div className="pt-2">
            <GlobalSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={handleGlobalSearchSubmit}
              totalResults={recentOrders.length}
            />
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Platform Overview Metrics</span>
          </h3>
          <span className="text-xs text-slate-400">Live Database Aggregations</span>
        </div>

        <MetricCards kpis={analytics?.kpis || {}} isLoading={loading} />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Orders Over Time (Area Chart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-base">Revenue & Orders Growth</h3>
              <p className="text-xs text-slate-400">Monthly revenue trends from relational orders</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              +$284.9k Total Revenue
            </span>
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="w-full h-full bg-slate-800/30 skeleton-shimmer rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.timeline || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month_label" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Orders by Status (Donut Chart) */}
        <div className="p-6 rounded-3xl bg-[#111827]/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Orders by Status</h3>
            <p className="text-xs text-slate-400 mb-4">Distribution across fulfillment stages</p>

            <div className="h-44 w-full flex items-center justify-center">
              {loading ? (
                <div className="w-32 h-32 rounded-full bg-slate-800/40 skeleton-shimmer" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.statusBreakdown || []}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
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

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {(analytics?.statusBreakdown || []).slice(0, 4).map(st => (
              <div key={st.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[st.status] || '#8B5CF6' }} />
                  <span className="text-slate-300">{st.status}</span>
                </div>
                <span className="font-mono font-bold text-white">{st.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Joined Orders Stream Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <span>Recent Joined Orders</span>
            </h3>
            <p className="text-xs text-slate-400">Showing order records joined with customer profile data</p>
          </div>

          <button
            onClick={() => onNavigate('orders')}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>View All 1,600 Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <OrdersTable
          orders={recentOrders}
          isLoading={loading}
          onSelectOrder={onSelectOrder}
          onSelectCustomer={onSelectCustomer}
        />
      </div>
    </div>
  );
}
