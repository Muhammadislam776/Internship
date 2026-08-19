import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Table, 
  Grid, 
  Filter, 
  Search, 
  Sparkles, 
  RotateCcw,
  Plus
} from 'lucide-react';
import OrdersTable from '../components/OrdersTable';
import OrdersCardGrid from '../components/OrdersCardGrid';
import GlobalSearch from '../components/GlobalSearch';
import FilterPanel from '../components/FilterPanel';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import { fetchOrders, logSearchQuery } from '../services/api';

export default function OrdersPage({ 
  onSelectOrder, 
  onSelectCustomer, 
  initialSearch = '' 
}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('date_desc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [filters, setFilters] = useState({
    status: [],
    payment_status: [],
    customer_type: [],
    category: [],
    date_range: '',
    min_amount: '',
    max_amount: ''
  });

  const loadOrders = () => {
    setLoading(true);
    fetchOrders({
      q: searchQuery,
      status: filters.status,
      payment_status: filters.payment_status,
      customer_type: filters.customer_type,
      category: filters.category,
      date_range: filters.date_range,
      min_amount: filters.min_amount,
      max_amount: filters.max_amount,
      sort_by: sortBy,
      page,
      limit
    }).then(res => {
      setOrders(res.data || []);
      setTotal(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching orders:', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
  }, [searchQuery, filters, sortBy, page, limit]);

  const handleResetFilters = () => {
    setFilters({
      status: [],
      payment_status: [],
      customer_type: [],
      category: [],
      date_range: '',
      min_amount: '',
      max_amount: ''
    });
    setSearchQuery('');
    setPage(1);
  };

  const handleSearchSubmit = (q) => {
    if (q) logSearchQuery(q);
    setPage(1);
  };

  const activeFiltersCount = 
    (filters.status?.length || 0) +
    (filters.payment_status?.length || 0) +
    (filters.customer_type?.length || 0) +
    (filters.category?.length || 0) +
    (filters.date_range ? 1 : 0) +
    (filters.min_amount || filters.max_amount ? 1 : 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Joined Orders Explorer</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40 text-xs font-mono font-bold">
              {total.toLocaleString()} Orders
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Relational dataset combining <code className="text-indigo-300">orders</code> and <code className="text-cyan-300">customers</code> via SQL JOIN
          </p>
        </div>

        {/* View Mode Switch (Table ↔ 3D Flip Card) */}
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-2xl bg-[#111827] border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Table View</span>
            </button>

            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                viewMode === 'card'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>3D Card View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Search & Control Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex-1">
          <GlobalSearch
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            onSearchSubmit={handleSearchSubmit}
            totalResults={total}
            isLoading={loading}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
              showFilterPanel || activeFiltersCount > 0
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#111827] border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-indigo-900 text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>

      {/* Expandable Advanced Filter Panel */}
      {showFilterPanel && (
        <FilterPanel
          filters={filters}
          setFilters={(f) => {
            setFilters(f);
            setPage(1);
          }}
          onResetFilters={handleResetFilters}
          isOpen={showFilterPanel}
          setIsOpen={setShowFilterPanel}
        />
      )}

      {/* Orders Data View (Table or 3D Cards) */}
      {viewMode === 'table' ? (
        <OrdersTable
          orders={orders}
          isLoading={loading}
          onSelectOrder={onSelectOrder}
          onSelectCustomer={onSelectCustomer}
        />
      ) : (
        <OrdersCardGrid
          orders={orders}
          isLoading={loading}
          onSelectOrder={onSelectOrder}
          onSelectCustomer={onSelectCustomer}
        />
      )}

      {/* Pagination Footer */}
      <Pagination
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
}
