import React from 'react';
import { Filter, RotateCcw, X, Calendar, DollarSign, Tag, UserCheck, ShieldAlert } from 'lucide-react';

export default function FilterPanel({ 
  filters, 
  setFilters, 
  onResetFilters,
  isOpen,
  setIsOpen
}) {
  const statuses = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled'];
  const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
  const customerTypes = ['Premium', 'Regular', 'New'];
  const categories = ['Electronics', 'Audio', 'Home & Office', 'Apparel', 'Accessories', 'Fitness'];
  const dateRanges = [
    { label: 'All Time', value: '' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' }
  ];

  const handleArrayToggle = (key, item) => {
    const current = filters[key] || [];
    let updated = [];
    if (current.includes(item)) {
      updated = current.filter(i => i !== item);
    } else {
      updated = [...current, item];
    }
    setFilters({ ...filters, [key]: updated });
  };

  const activeCount = 
    (filters.status?.length || 0) +
    (filters.payment_status?.length || 0) +
    (filters.customer_type?.length || 0) +
    (filters.category?.length || 0) +
    (filters.date_range ? 1 : 0) +
    (filters.min_amount || filters.max_amount ? 1 : 0);

  return (
    <div className="bg-[#111827]/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-sm">Advanced Order Filters</h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
              {activeCount} active
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Filter Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Order Status</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map(st => {
              const selected = (filters.status || []).includes(st);
              return (
                <button
                  key={st}
                  onClick={() => handleArrayToggle('status', st)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    selected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payment Status</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {paymentStatuses.map(ps => {
              const selected = (filters.payment_status || []).includes(ps);
              return (
                <button
                  key={ps}
                  onClick={() => handleArrayToggle('payment_status', ps)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    selected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ps}
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Type Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customer Tier</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {customerTypes.map(ct => {
              const selected = (filters.customer_type || []).includes(ct);
              return (
                <button
                  key={ct}
                  onClick={() => handleArrayToggle('customer_type', ct)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    selected
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ct}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Date Range</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {dateRanges.map(dr => {
              const selected = (filters.date_range || '') === dr.value;
              return (
                <button
                  key={dr.label}
                  onClick={() => setFilters({ ...filters, date_range: dr.value })}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    selected
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {dr.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Range Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-purple-400" />
            <span>Amount ($) Range</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.min_amount || ''}
              onChange={(e) => setFilters({ ...filters, min_amount: e.target.value })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500 text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.max_amount || ''}
              onChange={(e) => setFilters({ ...filters, max_amount: e.target.value })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
