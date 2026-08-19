import React from 'react';

export default function MetricCard({ title, value, change, isPositive, icon: Icon, color = "blue" }) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
          {value}
        </h3>
        {change && (
          <div className="flex items-center space-x-1.5 mt-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
            <span className="text-[11px] text-slate-400">vs last month</span>
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorStyles[color] || colorStyles.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
