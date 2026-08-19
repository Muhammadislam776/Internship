import React from 'react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isCartDrawerOpen, closeCartDrawer } = useCart();
  const { setCurrentView } = useApp();

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    setCurrentView('ecommerce-checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay */}
      <div 
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col justify-between overflow-y-auto animate-slide-left">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Your Shopping Cart ({cartItems.length})
                </h2>
                <p className="text-xs text-slate-500">Persistent E-Commerce Cart</p>
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Items List */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center space-x-4 shadow-xs"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-blue-600 font-extrabold mt-0.5">${item.price}.00 / unit</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 font-heading">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-slate-700">Your cart is currently empty</p>
                <p className="text-xs">Add items from the catalog to proceed to multi-step checkout.</p>
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/90 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Express Shipping</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Due</span>
                  <span className="text-2xl font-black text-blue-600 font-heading">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-base flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
              >
                <span>Proceed to E-Commerce Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
