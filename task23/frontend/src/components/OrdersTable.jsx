import React from 'react';
import { 
  Eye, 
  User, 
  MapPin, 
  Calendar, 
  Package, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function OrdersTable({ 
  orders = [], 
  isLoading = false, 
  onSelectOrder, 
  onSelectCustomer 
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Truck className="w-3 h-3" />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (payment) => {
    switch (payment) {
      case 'Paid':
        return <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">Paid</span>;
      case 'Pending':
        return <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">Pending</span>;
      case 'Failed':
        return <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">Failed</span>;
      case 'Refunded':
        return <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">Refunded</span>;
      default:
        return <span className="text-[11px] font-semibold text-slate-400">{payment}</span>;
    }
  };

  const getCustomerTypeBadge = (type) => {
    if (type === 'Premium') {
      return <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-1.5 py-0.2 rounded font-mono">Premium</span>;
    } else if (type === 'Regular') {
      return <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 px-1.5 py-0.2 rounded font-mono">Regular</span>;
    }
    return <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">New</span>;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#111827]/90 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-800/40 skeleton-shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full p-12 text-center bg-[#111827]/80 rounded-2xl border border-slate-800/80">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Matching Joined Orders Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          No orders matched your current search parameters across the joined database tables. Try adjusting your query or resetting filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#111827]/90 rounded-2xl border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-800 bg-[#0F172A]/80 text-xs font-semibold uppercase tracking-wider text-slate-400 sticky top-0 backdrop-blur-md">
              <th className="py-4 px-4 pl-6">Customer (Joined)</th>
              <th className="py-4 px-4">Order #</th>
              <th className="py-4 px-4">Product Details</th>
              <th className="py-4 px-4">Amount</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Payment</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {orders.map((order) => (
              <tr 
                key={order.id}
                className="hover:bg-slate-800/40 transition-colors duration-150 group"
              >
                {/* Customer Column */}
                <td className="py-4 px-4 pl-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectCustomer(order.customer_id)}
                      className="relative flex-shrink-0 group/avatar"
                    >
                      <img
                        src={order.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={order.customer_name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover/avatar:ring-indigo-400 transition-all"
                        loading="lazy"
                      />
                    </button>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectCustomer(order.customer_id)}
                          className="font-semibold text-slate-100 hover:text-indigo-300 truncate text-left transition-colors"
                        >
                          {order.customer_name}
                        </button>
                        {getCustomerTypeBadge(order.customer_type)}
                      </div>
                      <span className="text-xs text-slate-400 truncate">{order.customer_email}</span>
                    </div>
                  </div>
                </td>

                {/* Order Number Column */}
                <td className="py-4 px-4">
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-2.5 py-1 rounded-lg">
                    {order.order_number}
                  </span>
                </td>

                {/* Product Details Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.product_image}
                      alt={order.product_name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700/60 flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-slate-200 truncate max-w-[200px]">
                        {order.product_name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {order.category}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Amount Column */}
                <td className="py-4 px-4">
                  <span className="font-mono font-bold text-white text-base">
                    ${parseFloat(order.amount).toFixed(2)}
                  </span>
                </td>

                {/* Status Column */}
                <td className="py-4 px-4">
                  {getStatusBadge(order.status)}
                </td>

                {/* Payment Status Column */}
                <td className="py-4 px-4">
                  {getPaymentBadge(order.payment_status)}
                </td>

                {/* Location Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{order.shipping_city}, {order.customer_country || 'USA'}</span>
                  </div>
                </td>

                {/* Date Column */}
                <td className="py-4 px-4">
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(order.order_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </td>

                {/* Actions Column */}
                <td className="py-4 px-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onSelectOrder(order.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onSelectCustomer(order.customer_id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="View Customer Profile"
                    >
                      <User className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
