import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { fetchCustomerById, fetchCustomerOrders } from '../services/api';

export default function CustomerDrawer({ customerId, onClose, onSelectOrder }) {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);

    Promise.all([
      fetchCustomerById(customerId),
      fetchCustomerOrders(customerId)
    ]).then(([custRes, ordersRes]) => {
      setCustomer(custRes.data);
      setOrders(ordersRes.data || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading customer drawer data:', err);
      setLoading(false);
    });
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-slide-up">
      <div className="w-full max-w-xl bg-[#0F172A] border-l border-slate-800 h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 bg-[#0F172A]/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Customer Intelligence Profile</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {loading ? (
          <div className="p-6 space-y-6 flex-1">
            <div className="h-32 bg-slate-800/40 skeleton-shimmer rounded-2xl" />
            <div className="h-24 bg-slate-800/40 skeleton-shimmer rounded-2xl" />
            <div className="h-64 bg-slate-800/40 skeleton-shimmer rounded-2xl" />
          </div>
        ) : customer ? (
          <div className="p-6 space-y-6 flex-1">
            {/* Main Profile Header Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-[#111827] to-slate-900 border border-indigo-500/30 shadow-lg">
              <div className="flex items-start gap-4">
                <img
                  src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                  alt={customer.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/30 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-extrabold text-white truncate">{customer.name}</h3>
                    <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-md font-mono">
                      {customer.customer_type}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{customer.email}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{customer.phone || '+1 (555) 019-2831'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{customer.city}, {customer.country}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer CRM Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Orders</span>
                <span className="text-xl font-bold font-mono text-white">{customer.total_orders || orders.length}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Lifetime Spend</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ${parseFloat(customer.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Avg Order Value</span>
                <span className="text-base font-bold font-mono text-indigo-300">
                  ${parseFloat(customer.avg_order_value || 0).toFixed(2)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Last Order</span>
                <span className="text-xs font-mono text-slate-300">
                  {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Relational Order History Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  <span>Order History (Customer ➔ Orders JOIN)</span>
                </h4>
                <span className="text-xs text-indigo-400 font-mono font-bold">
                  {orders.length} Orders
                </span>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No order records found for this customer.</p>
              ) : (
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        onClose();
                        onSelectOrder(ord.id);
                      }}
                      className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.product_image}
                          alt={ord.product_name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-300">{ord.order_number}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-medium">
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                            {ord.product_name}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-white block">
                          ${parseFloat(ord.amount).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(ord.order_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
