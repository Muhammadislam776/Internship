import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SearchIntelligencePage from './pages/SearchIntelligencePage';
import HowItWorksPage from './pages/HowItWorksPage';

import OrderDetailModal from './components/OrderDetailModal';
import CustomerDrawer from './components/CustomerDrawer';
import HowItWorksModal from './components/HowItWorksModal';
import Toast from './components/Toast';
import { fetchOrderById } from './services/api';
import { Menu, HelpCircle, Sparkles, Command } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  const [toast, setToast] = useState(null);

  const showNotification = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectOrder = async (orderId) => {
    try {
      const res = await fetchOrderById(orderId);
      if (res.data) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
      showNotification('Failed to load order details');
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
  };

  const handleNavigate = (tab, params = {}) => {
    setActiveTab(tab);
    if (params.search) {
      setInitialSearchQuery(params.search);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-6 bg-[#0F172A]/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="text-indigo-400">OrderSphere</span>
              <span>/</span>
              <span className="text-white capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/40 text-indigo-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>How JOIN & FTS Work</span>
            </button>
          </div>
        </header>

        {/* Viewport View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardPage
                onSelectOrder={handleSelectOrder}
                onSelectCustomer={handleSelectCustomer}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersPage
                onSelectOrder={handleSelectOrder}
                onSelectCustomer={handleSelectCustomer}
                initialSearch={initialSearchQuery}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersPage
                onSelectCustomer={handleSelectCustomer}
              />
            )}

            {activeTab === 'search-intel' && (
              <SearchIntelligencePage
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPage />
            )}

            {activeTab === 'how-it-works' && (
              <HowItWorksPage />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSelectCustomer={handleSelectCustomer}
        />
      )}

      {selectedCustomerId && (
        <CustomerDrawer
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
          onSelectOrder={handleSelectOrder}
        />
      )}

      {showHowItWorksModal && (
        <HowItWorksModal
          isOpen={showHowItWorksModal}
          onClose={() => setShowHowItWorksModal(false)}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
