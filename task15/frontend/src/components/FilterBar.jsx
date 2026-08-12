import React from 'react';
import { Filter, ArrowUpDown, ShieldCheck, CheckCircle2, UserCheck, Clock } from 'lucide-react';

export const FilterBar = ({ 
  role, 
  onRoleChange, 
  status, 
  onStatusChange, 
  sortBy, 
  onSortChange,
  perPage,
  onPerPageChange,
  totalResults
}) => {
  const roleOptions = [
    { id: 'all', label: 'All Roles' },
    { id: 'admin', label: 'Admin' },
    { id: 'moderator', label: 'Moderator' },
    { id: 'user', label: 'User' }
  ];

  const statusOptions = [
    { id: 'all', label: 'All Statuses' },
    { id: 'verified', label: 'Verified Email' },
    { id: 'unverified', label: 'Unverified Email' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Joined: Newest' },
    { id: 'oldest', label: 'Joined: Oldest' },
    { id: 'name-asc', label: 'Name: A – Z' },
    { id: 'name-desc', label: 'Name: Z – A' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-xl mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Role Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#9FB0C2] flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#22D3EE]" /> Role:
          </span>
          {roleOptions.map((opt) => {
            const isActive = role === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onRoleChange(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#22D3EE] text-white shadow-md shadow-[#22D3EE]/20 border border-white/20'
                    : 'glass-card text-[#9FB0C2] hover:text-white hover:border-[#22D3EE]/30'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#9FB0C2] flex items-center gap-1.5 mr-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Status:
          </span>
          {statusOptions.map((opt) => {
            const isActive = status === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onStatusChange(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FF7A18] text-white shadow-md shadow-[#FF7A18]/30 border border-white/20'
                    : 'glass-card text-[#9FB0C2] hover:text-white hover:border-[#FF7A18]/40'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Second Row: Sort dropdown & Per page selector */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9FB0C2]">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span className="font-semibold text-white">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="glass-input rounded-xl px-3 py-1.5 text-xs text-white bg-[#071A2B] border border-white/10 focus:border-[#22D3EE] cursor-pointer"
          >
            {sortOptions.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#071A2B] text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="glass-input rounded-xl px-2.5 py-1 text-xs text-white bg-[#071A2B] border border-white/10 focus:border-[#22D3EE] cursor-pointer"
            >
              <option value={10} className="bg-[#071A2B]">10 users</option>
              <option value={25} className="bg-[#071A2B]">25 users</option>
              <option value={50} className="bg-[#071A2B]">50 users</option>
              <option value={100} className="bg-[#071A2B]">100 users</option>
            </select>
          </div>

          <span className="font-mono text-[11px] text-[#22D3EE]">
            Matches: <strong className="text-white">{totalResults}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
