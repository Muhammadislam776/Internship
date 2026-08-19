import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import SecurityPanel from '../components/SecurityPanel';
import HowItWorks from '../components/HowItWorks';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  CreditCard,
  Check
} from 'lucide-react';

export default function Landing() {
  const { setCurrentView, products, openCheckoutDrawer } = useApp();

  return (
    <div className="space-y-20 pb-16">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Decorative Light Background Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 via-orange-100/30 to-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Modern Stripe Checkout Engine</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight font-heading tracking-tight">
                Payments Made <br className="hidden sm:block" />
                <span className="text-gradient-blue-orange">Beautifully Simple.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Discover premium products and complete your purchase through a fast, secure Stripe-powered checkout experience.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('pricing-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else setCurrentView('products');
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-base flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Explore Products</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>

                <button
                  onClick={() => setCurrentView('how-it-works')}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-base flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <span>View How It Works</span>
                </button>
              </div>

              {/* Floating Security Trust Badges */}
              <div className="pt-6 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-1.5 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <Check className="w-4 h-4 text-emerald-500 font-bold" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <Check className="w-4 h-4 text-blue-600 font-bold" />
                  <span>Stripe Checkout</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <Check className="w-4 h-4 text-orange-500 font-bold" />
                  <span>256-bit Encrypted</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <Check className="w-4 h-4 text-emerald-500 font-bold" />
                  <span>Fast Processing</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Hero Illustration Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Floating Decorative Elements */}
              <div className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Stripe Verified</p>
                  <p className="text-[10px] text-slate-500">Official Checkout Session</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-3 animate-float [animation-delay:2s]">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Zero Local Storage</p>
                  <p className="text-[10px] text-slate-500">PCI-DSS Compliant</p>
                </div>
              </div>

              {/* Main Card Graphic */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-blue-500/20 relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
                
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      💳
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">PayFlow Card</h4>
                      <p className="text-xs text-slate-400">Smart Checkout Session</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Test Mode
                  </span>
                </div>

                <div className="my-8 space-y-3">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                    •••• •••• •••• 4242
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Card Holder</p>
                      <p className="text-sm font-bold text-slate-200">STRIPE TEST USER</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Expires</p>
                      <p className="text-sm font-bold text-slate-200">12 / 28</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Pro Plan Subscription</p>
                    <p className="text-lg font-bold text-white">$49.00 / mo</p>
                  </div>
                  <button
                    onClick={() => openCheckoutDrawer(products[1] || products[0])}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
                  >
                    Test Checkout →
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= PRICING & PRODUCTS GRID ================= */}
      <section id="pricing-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Flexible Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 font-heading">
            Choose Your Plan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Select a plan to launch a real Stripe Checkout Session. Hover or click <span className="text-orange-500 font-bold">Flip Card 🔄</span> to inspect features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ================= SECURITY PANEL ================= */}
      <SecurityPanel />

      {/* ================= HOW IT WORKS SECTION ================= */}
      <HowItWorks />

    </div>
  );
}
