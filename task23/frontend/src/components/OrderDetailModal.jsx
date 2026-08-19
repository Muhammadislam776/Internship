import React from 'react';
import { 
  X, 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Check, 
  XCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function OrderDetailModal({ order, onClose, onSelectCustomer }) {
  if (!order) return null;

  const timelineSteps = [
    { label: 'Order Placed', step: 1 },
    { label: 'Payment Confirmed', step: 2 },
    { label: 'Processing', step: 3 },
    { label: 'Shipped', step: 4 },
    { label: 'Delivered', step: 5 }
  ];

  const getStepProgress = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return -1;
      default: return 2;
    }
  };

  const currentProgressStep = getStepProgress(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-slide-up">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">{order.order_number}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Placed on {new Date(order.order_date).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Animated Order Timeline Tracker */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Animated Order Fulfillment Timeline</span>
            </h4>

            {order.status === 'Cancelled' ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
                <XCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <span className="font-bold block">Order Cancelled</span>
                  <span className="text-xs text-rose-300/80">This order was cancelled and payment has been processed for refund.</span>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-between px-2">
                {/* Connecting Progress Line */}
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2 -z-0">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-700"
                    style={{ width: `${((currentProgressStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
                  />
                </div>

                {timelineSteps.map((stepItem) => {
                  const isDone = currentProgressStep >= stepItem.step;
                  const isCurrent = currentProgressStep === stepItem.step;

                  return (
                    <div key={stepItem.step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isDone 
                          ? 'bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-4 ring-slate-900' 
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-500 ring-4 ring-slate-900'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : stepItem.step}
                      </div>
                      <span className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] ${
                        isDone ? 'text-slate-200' : 'text-slate-500'
                      }`}>
                        {stepItem.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Grid: Customer & Product Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer Information Card */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>Customer Profile (Joined Table)</span>
                </span>

                <button
                  onClick={() => {
                    onClose();
                    onSelectCustomer(order.customer_id);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>View Full Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={order.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={order.customer_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <h4 className="font-bold text-white text-base">{order.customer_name}</h4>
                  <p className="text-xs text-slate-400">{order.customer_email}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono">{order.customer_phone || '+1 (555) 234-5678'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span>{order.shipping_city}, {order.customer_country || 'USA'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Tier:</span>
                  <span className="font-semibold text-indigo-400">{order.customer_type}</span>
                </div>
              </div>
            </div>

            {/* Product Information Card */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-purple-400" />
                <span>Product Item</span>
              </span>

              <div className="flex gap-4 pt-2">
                <img
                  src={order.product_image}
                  alt={order.product_name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 bg-slate-800 flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-2">{order.product_name}</h4>
                  <span className="inline-block mt-1 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Category: {order.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-semibold text-emerald-400">{order.payment_status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="font-mono font-extrabold text-lg text-white">
                    ${parseFloat(order.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
