import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShoppingBag, 
  DollarSign, 
  MapPin, 
  Mail, 
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { fetchCustomers } from '../services/api';
import Pagination from '../components/Pagination';

export default function CustomersPage({ onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [customerType, setCustomerType] = useState('');

  const loadCustomers = () => {
    setLoading(true);
    fetchCustomers({
      search,
      customer_type: customerType,
      page,
      limit
    }).then(res => {
      setCustomers(res.data || []);
      setTotal(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading customers:', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCustomers();
  }, [search, customerType, page, limit]);

  const getTierBadge = (type) => {
    if (type === 'Premium') {
      return <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-2 py-0.5 rounded-md font-mono">Premium</span>;
    } else if (type === 'Regular') {
      return <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded-md font-mono">Regular</span>;
    }
    return <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">New</span>;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Customer Intelligence CRM</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40 text-xs font-mono font-bold">
              {total.toLocaleString()} Active Profiles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore customer accounts and their associated order history records
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Customer Tier Selector */}
          <select
            value={customerType}
            onChange={(e) => {
              setCustomerType(e.target.value);
              setPage(1);
            }}
            className="bg-[#111827] border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">All Customer Tiers</option>
            <option value="Premium">Premium Tiers</option>
            <option value="Regular">Regular Tiers</option>
            <option value="New">New Tiers</option>
          </select>
        </div>
      </div>

      {/* Customer Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Filter customers by name, email, city..."
          className="w-full bg-[#111827] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Customer CRM Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-800/40 skeleton-shimmer border border-slate-800" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="p-12 text-center bg-[#111827]/80 rounded-2xl border border-slate-800">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Customers Found</h3>
          <p className="text-xs text-slate-400">Try clearing search parameters to display customer profiles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {customers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => onSelectCustomer(cust.id)}
              className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/90 hover:border-indigo-500/40 shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={cust.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition-all flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors truncate">
                        {cust.name}
                      </h3>
                      {getTierBadge(cust.customer_type)}
                    </div>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </p>
                  </div>
                </div>

                {/* Location Pill */}
                <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/50 px-2.5 py-1 rounded-xl mb-4">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{cust.city}, {cust.country}</span>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Orders:</span>
                  <span className="font-mono font-bold text-indigo-300">{cust.total_orders || 0} Orders</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Lifetime Spend:</span>
                  <span className="font-mono font-extrabold text-white text-sm">
                    ${parseFloat(cust.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <Pagination
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
      />
    </div>
  );
}
