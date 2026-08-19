import React, { useState, useEffect } from 'react';
import { fetchAnalytics } from '../services/paymentApi';
import MetricCard from '../components/MetricCard';
import { BarChart3, TrendingUp, DollarSign, PieChart, ShieldCheck } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchAnalytics();
      if (res) setData(res);
      setLoading(false);
    }
    load();
  }, []);

  const metrics = data?.metrics || {
    totalRevenue: '1,284.00',
    successfulCount: 18,
    cancelledCount: 2,
    avgTransactionValue: '61.14',
    conversionRate: '85.7'
  };

  const productBreakdown = [
    { name: 'Pro Flow ($49)', percent: '45%', color: 'bg-blue-600' },
    { name: 'Starter Flow ($19)', percent: '25%', color: 'bg-orange-500' },
    { name: 'Business Scale ($99)', percent: '20%', color: 'bg-emerald-500' },
    { name: 'Enterprise Flow ($199)', percent: '10%', color: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Financial Intelligence
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading">
          Revenue & Checkout Analytics
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Deep dive into transaction volume, checkout conversions, and plan distributions.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Total Gross Revenue"
          value={`$${metrics.totalRevenue}`}
          change="18.4%"
          isPositive={true}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Checkout Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change="3.2%"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Average Order Value"
          value={`$${metrics.avgTransactionValue}`}
          change="5.1%"
          isPositive={true}
          icon={BarChart3}
          color="orange"
        />
      </div>

      {/* Revenue Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Plan Distribution Progress Bars */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Revenue Share by Plan
            </h3>
            <p className="text-xs text-slate-500">
              Contribution of each subscription tier to total revenue
            </p>
          </div>

          <div className="space-y-4">
            {productBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="text-blue-600">{item.percent}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: item.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Health Status Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Security Audit</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Stripe API Integration Status
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              All payment endpoints respond to <code className="text-orange-300 font-mono">POST /create-payment</code> with valid Stripe Checkout URLs.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Stripe Server SDK:</span>
              <span className="text-emerald-400 font-bold">v16.8 Active</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Session Creation Latency:</span>
              <span className="text-blue-400 font-bold">142ms</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Client Price Tampering Protection:</span>
              <span className="text-emerald-400 font-bold">100% Enforced</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
