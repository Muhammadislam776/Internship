import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function SortDropdown({ sortBy, setSortBy }) {
  const options = [
    { label: 'Newest Orders', value: 'date_desc' },
    { label: 'Oldest Orders', value: 'date_asc' },
    { label: 'Amount: High to Low', value: 'amount_desc' },
    { label: 'Amount: Low to High', value: 'amount_asc' },
    { label: 'Customer: A to Z', value: 'customer_asc' },
    { label: 'Customer: Z to A', value: 'customer_desc' },
  ];

  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 text-indigo-400 pointer-events-none">
        <ArrowUpDown className="w-3.5 h-3.5" />
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-slate-200 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0F172A] text-slate-200">
            Sort: {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
