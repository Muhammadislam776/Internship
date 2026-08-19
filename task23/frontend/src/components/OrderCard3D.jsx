import React, { useState } from 'react';
import { 
  RotateCw, 
  Eye, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  Sparkles
} from 'lucide-react';

export default function OrderCard3D({ order, onSelectOrder, onSelectCustomer }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Delivered</span>;
      case 'Shipped':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Shipped</span>;
      case 'Processing':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Processing</span>;
      case 'Pending':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>;
      case 'Cancelled':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Cancelled</span>;
      default:
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="perspective-1000 w-full h-[400px]">
      <div 
        className={`relative w-full h-full transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-[#111827]/90 border border-slate-800/90 shadow-xl overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 group">
          {/* Product Image Header */}
          <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
            <img
              src={order.product_image}
              alt={order.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/40" />

            {/* Category Tag */}
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-semibold text-cyan-300 border border-white/10">
              {order.category}
            </span>

            {/* Flip Card Trigger */}
            <button
              onClick={() => setIsFlipped(true)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-1 text-xs font-medium"
              title="Click to Flip Card for Back Details"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip 3D</span>
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-100 text-base line-clamp-1 mb-2">
                {order.product_name}
              </h4>

              {/* Customer Info Row */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 mb-3">
                <img
                  src={order.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={order.customer_name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 flex-shrink-0"
                />
                <div className="min-w-0">
                  <button
                    onClick={() => onSelectCustomer(order.customer_id)}
                    className="text-xs font-semibold text-slate-200 hover:text-indigo-300 truncate block text-left"
                  >
                    {order.customer_name}
                  </button>
                  <span className="text-[11px] text-slate-400 truncate block">{order.customer_email}</span>
                </div>
              </div>
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Amount</span>
                <span className="font-mono font-bold text-lg text-white">
                  ${parseFloat(order.amount).toFixed(2)}
                </span>
              </div>

              <div>
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-slate-900 via-[#111827] to-indigo-950/40 border border-indigo-500/30 shadow-2xl p-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-sm text-indigo-300">
                  {order.order_number}
                </span>
              </div>

              <button
                onClick={() => setIsFlipped(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Front</span>
              </button>
            </div>

            {/* Back Details Grid */}
            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{order.customer_email}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{order.customer_phone || '+1 (555) 234-5678'}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Shipping: {order.shipping_city}, {order.customer_country || 'USA'}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Order Date: {new Date(order.order_date).toLocaleDateString()}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Payment Status</span>
                <span className="font-semibold text-emerald-400">{order.payment_status}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => onSelectOrder(order.id)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Order Details</span>
            </button>

            <button
              onClick={() => onSelectCustomer(order.customer_id)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open Customer Intelligence Drawer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
