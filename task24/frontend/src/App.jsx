import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import CheckoutPreview from './components/CheckoutPreview';
import Toast from './components/Toast';
import IncomingSmsBanner from './components/IncomingSmsBanner';

import Landing from './pages/Landing';
import ProductsPage from './pages/ProductsPage';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Success from './pages/Success';
import Cancelled from './pages/Cancelled';
import HowItWorks from './components/HowItWorks';
import ECommerceCheckout from './pages/ECommerceCheckout';

export default function App() {
  const { currentView, setCurrentView } = useApp();

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('payment-success') || window.location.search.includes('session_id')) {
      setCurrentView('success');
    } else if (path.includes('payment-cancelled')) {
      setCurrentView('cancelled');
    }
  }, [setCurrentView]);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing />;
      case 'products':
        return <ProductsPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'ecommerce-checkout':
        return <ECommerceCheckout />;
      case 'success':
        return <Success />;
      case 'cancelled':
        return <Cancelled />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white relative">
      
      {/* Top Mobile SMS Incoming Message Banner */}
      <IncomingSmsBanner />

      {/* Top Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Sliding Stripe Preview Drawer */}
      <CheckoutPreview />

      {/* Toast Notifications */}
      <Toast />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 font-heading">
              Pay<span className="text-orange-500">Flow</span>
            </span>
            <span>— E-Commerce Multi-Payment Platform</span>
          </div>

          <p className="text-slate-400">
            Supports Real Twilio SIM SMS Delivery, Stripe Checkout, Direct Card ATM PIN, QR Wallet & COD.
          </p>

          <div className="flex items-center space-x-4 font-semibold text-slate-600">
            <button onClick={() => setCurrentView('how-it-works')} className="hover:text-blue-600">
              API Docs
            </button>
            <button onClick={() => setCurrentView('settings')} className="hover:text-blue-600">
              Settings
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
