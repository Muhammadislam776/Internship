import React from 'react';
import OrderCard3D from './OrderCard3D';
import { Package } from 'lucide-react';

export default function OrdersCardGrid({ 
  orders = [], 
  isLoading = false, 
  onSelectOrder, 
  onSelectCustomer 
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[400px] rounded-2xl bg-slate-800/40 skeleton-shimmer border border-slate-800" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full p-12 text-center bg-[#111827]/80 rounded-2xl border border-slate-800/80">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Orders Found in Card View</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Try clearing your search query or modifying active filters to display 3D order cards.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {orders.map((order) => (
        <OrderCard3D
          key={order.id}
          order={order}
          onSelectOrder={onSelectOrder}
          onSelectCustomer={onSelectCustomer}
        />
      ))}
    </div>
  );
}
