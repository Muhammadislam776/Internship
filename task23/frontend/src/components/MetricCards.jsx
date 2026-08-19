import React from 'react';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

export default function MetricCards({ kpis = {}, isLoading = false }) {
  const cards = [
    {
      title: 'Total Orders',
      value: kpis.totalOrders ? kpis.totalOrders.toLocaleString() : '1,600',
      change: '+14.2% vs last month',
      icon: ShoppingBag,
      gradient: 'from-indigo-600/20 via-indigo-600/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
      glow: 'shadow-indigo-500/10'
    },
    {
      title: 'Active Customers',
      value: kpis.totalCustomers ? kpis.totalCustomers.toLocaleString() : '550',
      change: '+8.7% new signups',
      icon: Users,
      gradient: 'from-cyan-600/20 via-cyan-600/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      glow: 'shadow-cyan-500/10'
    },
    {
      title: 'Total Revenue',
      value: kpis.totalRevenue ? `$${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$284,920.00',
      change: '+22.4% net growth',
      icon: DollarSign,
      gradient: 'from-emerald-600/20 via-emerald-600/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      glow: 'shadow-emerald-500/10'
    },
    {
      title: 'Pending Orders',
      value: kpis.pendingOrders ? kpis.pendingOrders.toLocaleString() : '42',
      change: 'Requires processing',
      icon: Clock,
      gradient: 'from-amber-600/20 via-amber-600/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400',
      glow: 'shadow-amber-500/10'
    },
    {
      title: 'Delivered Orders',
      value: kpis.deliveredOrders ? kpis.deliveredOrders.toLocaleString() : '1,032',
      change: '98.6% completion rate',
      icon: CheckCircle2,
      gradient: 'from-purple-600/20 via-purple-600/10 to-transparent',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
      glow: 'shadow-purple-500/10'
    },
    {
      title: 'Average Order Value',
      value: kpis.avgOrderValue ? `$${kpis.avgOrderValue.toFixed(2)}` : '$228.40',
      change: '+5.1% basket size',
      icon: TrendingUp,
      gradient: 'from-blue-600/20 via-blue-600/10 to-transparent',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
      glow: 'shadow-blue-500/10'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-800/50 skeleton-shimmer border border-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`relative p-5 rounded-2xl bg-gradient-to-br ${card.gradient} bg-[#111827]/90 border ${card.borderColor} shadow-lg ${card.glow} hover:-translate-y-1 transition-all duration-300 group overflow-hidden`}
          >
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-extrabold tracking-tight text-white mb-1.5 font-mono">
              {card.value}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span>{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
