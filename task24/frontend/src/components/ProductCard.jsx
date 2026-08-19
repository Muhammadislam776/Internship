import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { 
  Check, 
  RotateCw, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  ShoppingBag, 
  Zap, 
  Lock, 
  Sparkles 
} from 'lucide-react';

export default function ProductCard({ product }) {
  const { openCheckoutDrawer, setCurrentView } = useApp();
  const { addToCart } = useCart();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product);
    setCurrentView('ecommerce-checkout');
  };

  return (
    <div className="perspective-1000 w-full h-[530px] group">
      <div 
        className={`relative w-full h-full transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ==================== CARD FRONT ==================== */}
        <div 
          onClick={() => setIsFlipped(true)}
          className={`absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 border-slate-100 hover:border-blue-200`}
        >
          {/* Top Badges */}
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {product.category || 'Plan'}
            </span>
            {product.popular && (
              <span className="flex items-center space-x-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full shadow-md shadow-orange-500/20 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{product.badge || 'Most Popular'}</span>
              </span>
            )}
          </div>

          {/* Product Image */}
          <div className="relative my-3 h-44 rounded-2xl overflow-hidden bg-slate-100 group-hover:shadow-md transition-all">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <span className="text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                ⭐ {product.rating} ({product.reviewsCount} reviews)
              </span>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="flex items-center space-x-1 text-xs font-semibold bg-white/90 text-slate-800 hover:bg-white px-2.5 py-1 rounded-lg shadow-sm transition-all"
              >
                <RotateCw className="w-3 h-3 text-orange-500" />
                <span>Flip Specs</span>
              </button>
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                {product.name}
              </h3>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-blue-600 font-heading">
                  ${product.price}
                </span>
                <span className="text-xs text-slate-500 font-medium">/unit</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Two Action Buttons: Add to Cart & Buy Now */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-200"
            >
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/15 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

        {/* ==================== CARD BACK ==================== */}
        <div 
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 border border-blue-500/30 shadow-2xl flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Features & Specs</span>
                <h3 className="text-lg font-bold text-white font-heading">{product.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <RotateCw className="w-4 h-4 text-orange-400" />
              </button>
            </div>

            <ul className="mt-4 space-y-2.5">
              {product.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                  <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Instant Checkout (${product.price})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
