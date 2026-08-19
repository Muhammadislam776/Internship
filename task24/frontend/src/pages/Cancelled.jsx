import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, ShoppingBag, ArrowLeft, HelpCircle } from 'lucide-react';

export default function Cancelled() {
  const { setCurrentView, openCheckoutDrawer, selectedProduct } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl text-center space-y-6">
        
        {/* Friendly Neutral Icon */}
        <div className="w-20 h-20 rounded-full bg-orange-50 border-4 border-orange-100 flex items-center justify-center mx-auto text-orange-500 shadow-md">
          <RefreshCw className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
            Checkout Incomplete
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
            Payment Cancelled
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
            No worries — your payment was not completed and your card was not charged.
          </p>
        </div>

        {/* Helpful Info Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-900 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Why was my checkout cancelled?</span>
          </p>
          <p>
            You may have intentionally clicked the back button or closed the Stripe payment tab. You can resume checkout at any time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
          <button
            onClick={() => {
              if (selectedProduct) openCheckoutDrawer(selectedProduct);
              else setCurrentView('products');
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Checkout Again</span>
          </button>

          <button
            onClick={() => setCurrentView('products')}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-2xl border border-slate-200 text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
        </div>

      </div>

    </div>
  );
}
