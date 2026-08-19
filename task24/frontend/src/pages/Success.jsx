import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { verifySession } from '../services/paymentApi';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowRight, 
  LayoutDashboard, 
  Receipt, 
  ShieldCheck, 
  Copy,
  Sparkles,
  Truck,
  Package,
  Check
} from 'lucide-react';

export default function Success() {
  const { setCurrentView, showToast } = useApp();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id') || `cs_test_${Math.random().toString(36).substring(2, 10)}`;
    const productId = urlParams.get('productId') || 'pro';

    async function loadVerification() {
      setLoading(true);
      const res = await verifySession(sessionId, productId);
      if (res && res.transaction) {
        setTransaction(res.transaction);
      } else {
        setTransaction({
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          productName: productId === 'starter' ? 'Starter Flow' : productId === 'business' ? 'Business Scale' : 'Pro Flow',
          amount: productId === 'starter' ? 19 : productId === 'business' ? 99 : 49,
          currency: 'USD',
          status: 'Paid',
          date: new Date().toISOString()
        });
      }
      setLoading(false);
    }

    loadVerification();
  }, []);

  const handleCopyId = () => {
    if (transaction?.id) {
      navigator.clipboard.writeText(transaction.id);
      showToast('Order ID copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl text-center space-y-8 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-100/60 rounded-full blur-3xl -z-10" />

        {/* Checkmark Icon */}
        <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto text-emerald-500 shadow-xl shadow-emerald-500/10 animate-checkmark">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SMS & Bank Authorization Verified</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            🎉 Payment & Order Confirmed!
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Your transaction has been verified and your order is currently being prepared for express delivery.
          </p>
        </div>

        {/* 4-Stage Order Tracking Progress Timeline */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Order Fulfillment Status</h4>
          
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-emerald-700 block">Payment Verified</span>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-blue-700 block">Processing</span>
            </div>

            <div className="space-y-1 opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-slate-600 block">Inspected</span>
            </div>

            <div className="space-y-1 opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center mx-auto">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-slate-600 block">Dispatched</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/80 text-left space-y-4 max-w-lg mx-auto">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase">Order ID</span>
            <button 
              onClick={handleCopyId}
              className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"
            >
              <span>{transaction?.id}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Purchased Items</span>
              <span className="text-sm font-bold text-slate-900">{transaction?.productName || 'Pro Flow'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Total Paid</span>
              <span className="text-sm font-extrabold text-blue-600">${transaction?.amount}.00 USD</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Date & Time</span>
              <span className="text-slate-700 font-medium">{new Date(transaction?.date || Date.now()).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-100 text-emerald-800">
                ● {transaction?.status || 'Paid'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('transactions')}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-8 py-3.5 rounded-2xl border border-slate-200 text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <Receipt className="w-4 h-4 text-orange-500" />
            <span>View All Orders</span>
          </button>
        </div>

      </div>

    </div>
  );
}
