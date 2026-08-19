import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  AlertTriangle, 
  RefreshCw,
  Sparkles,
  Tag,
  Mail,
  Copy,
  Check
} from 'lucide-react';

export default function CheckoutPreview() {
  const { 
    isCheckoutDrawerOpen, 
    closeCheckoutDrawer, 
    selectedProduct, 
    startCheckoutProcess, 
    isCheckoutLoading, 
    checkoutError,
    customerEmail,
    setCustomerEmail,
    couponCodeInput,
    setCouponCodeInput,
    appliedCoupon,
    handleApplyCoupon,
    showToast
  } = useApp();

  if (!isCheckoutDrawerOpen || !selectedProduct) return null;

  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountValue = (selectedProduct.price * appliedCoupon.value) / 100;
    } else {
      discountValue = Math.min(selectedProduct.price - 1, appliedCoupon.value);
    }
  }

  const finalTotal = Math.max(1, selectedProduct.price - discountValue);

  const handleCheckoutSubmit = () => {
    startCheckoutProcess(selectedProduct);
  };

  const copyTestCard = () => {
    navigator.clipboard.writeText('4242424242424242');
    showToast('Stripe Test Card 4242 4242 4242 4242 copied!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay */}
      <div 
        onClick={closeCheckoutDrawer}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col justify-between overflow-y-auto animate-slide-left">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Stripe Checkout Order
                </h2>
                <p className="text-xs text-slate-500">
                  Real API Session Generator
                </p>
              </div>
            </div>
            <button
              onClick={closeCheckoutDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 flex-1">
            
            {/* Stripe Test Card Quick Bar */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-3.5 border border-slate-800 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-orange-400" />
                <div>
                  <span className="font-mono text-amber-300 font-bold block">4242 4242 4242 4242</span>
                  <span className="text-[10px] text-slate-400">Stripe Official Test Card</span>
                </div>
              </div>
              <button
                onClick={copyTestCard}
                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
              >
                <Copy className="w-3 h-3 text-orange-400" />
                <span>Copy</span>
              </button>
            </div>

            {/* Selected Product Summary */}
            <div className="bg-gradient-to-r from-blue-50/80 to-orange-50/80 border border-blue-100 rounded-2xl p-4 flex items-center space-x-4">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                  {selectedProduct.category || 'Plan'}
                </span>
                <h4 className="text-base font-bold text-slate-900 truncate mt-1">
                  {selectedProduct.name}
                </h4>
                <p className="text-xs text-slate-500">Stripe Hosted Checkout</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-blue-600 font-heading">
                  ${selectedProduct.price}
                </span>
                <span className="text-[10px] text-slate-400 block">/mo</span>
              </div>
            </div>

            {/* Customer Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Customer Email Address (Optional)</span>
              </label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                <span>Promo / Coupon Code (Try: PAYFLOW20)</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. PAYFLOW20 or WELCOME10"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1 pt-1">
                  <Check className="w-3 h-3" />
                  <span>{appliedCoupon.code} applied ({appliedCoupon.description})</span>
                </p>
              )}
            </div>

            {/* Order Price Table */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Price</span>
                <span className="font-semibold text-slate-900">${selectedProduct.price}.00</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountValue.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-emerald-600">$0.00</span>
              </div>
              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-black text-blue-600 font-heading">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Error Message if API fails */}
            {checkoutError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">We couldn't start your checkout.</p>
                  <p className="mt-0.5">{checkoutError}</p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/80 space-y-3">
            <button
              onClick={handleCheckoutSubmit}
              disabled={isCheckoutLoading}
              className={`w-full font-bold py-4 px-6 rounded-2xl text-base flex items-center justify-center space-x-3 shadow-lg transition-all ${
                isCheckoutLoading
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-blue-500/25 hover:shadow-orange-500/30 active:scale-95'
              }`}
            >
              {isCheckoutLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Creating Secure Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-orange-300" />
                  <span>Secure Checkout →</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              Executes <code className="bg-slate-200 text-blue-700 px-1 py-0.5 rounded font-mono">POST /create-payment</code> & redirects to Stripe.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
