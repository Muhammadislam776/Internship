import React from 'react';
import { Filter, ArrowUpDown, Search, RefreshCw, Layers } from 'lucide-react';

const FilterBar = ({
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  users = [],
  onResetFilters
}) => {
  const priorities = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
    { label: 'Alphabetical', value: 'alphabetical' }
  ];

  return (
    <div className="glass-card rounded-2xl p-4 border border-cyber/20 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* Priority Pill Selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-cyber" /> Priority:
        </span>
        {priorities.map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
              priorityFilter === p
                ? 'bg-cyber text-midnight shadow-cyan-glow'
                : 'bg-midnight/60 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Dropdown Filters & Sorting */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        {/* Assignee Filter */}
        <select
          value={assigneeFilter || 'ALL'}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="px-3 py-1.5 bg-midnight border border-cyber/20 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyber cursor-pointer"
        >
          <option value="ALL">All Assignees</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1.5 bg-midnight border border-cyber/20 rounded-xl px-3 py-1.5 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyber shrink-0" />
          <select
            value={sortBy || 'newest'}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-midnight text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {(priorityFilter !== 'ALL' || assigneeFilter !== 'ALL' || searchQuery) && (
          <button
            onClick={onResetFilters}
            className="px-3 py-1.5 text-xs text-status-warning hover:bg-status-warning/10 rounded-xl border border-status-warning/30 transition-colors flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
