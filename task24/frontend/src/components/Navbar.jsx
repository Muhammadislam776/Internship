import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import { 
  CreditCard, 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  User,
  LogOut,
  Zap,
  ShoppingCart,
  DollarSign,
  Sparkles,
  Globe
} from 'lucide-react';

export default function Navbar() {
  const { currentView, setCurrentView, currency, setCurrency, stripeStatus, showToast } = useApp();
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: CreditCard },
    { id: 'products', label: 'Products', icon: ShoppingBag, badge: 'Catalog' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCurrencySwitch = (e) => {
    const newCurr = e.target.value;
    setCurrency(newCurr);
    localStorage.setItem('payflow_currency', newCurr);
    showToast(`Currency display changed to ${newCurr}`, 'info');
  };

  return (
    <>
      {/* Top Promotional Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center space-x-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-orange-300 animate-pulse" />
        <span>🔥 SPECIAL OFFER: Use Coupon <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-amber-300">PAYFLOW20</code> for 20% OFF! Free Worldwide Express Shipping! 🚚</span>
      </div>

      <header className="glass-header sticky top-0 z-40 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-orange-500 flex items-center justify-center shadow-lg shadow-blue-500/25 transform hover:scale-105 transition-transform duration-300">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
                    Pay<span className="text-orange-500">Flow</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                    <Zap className="w-3 h-3 mr-1 text-orange-500 fill-orange-500" />
                    E-Commerce Pay
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden md:block">
                  Amazon-Style Smart Payments
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center space-x-3">
              
              {/* Currency Selector */}
              <div className="hidden md:flex items-center space-x-1 bg-white border border-slate-200 px-2 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <select
                  value={currency}
                  onChange={handleCurrencySwitch}
                  className="bg-transparent focus:outline-none cursor-pointer font-bold"
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                  <option value="PKR">₨ PKR</option>
                  <option value="INR">₹ INR</option>
                </select>
              </div>

              {/* Cart Drawer Button */}
              <button
                onClick={openCartDrawer}
                className="relative p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 transition-all flex items-center space-x-1.5"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden xs:inline text-xs font-bold">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Avatar / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 bg-white p-1.5 pr-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-xl object-cover" />
                    <span className="text-xs font-bold text-slate-800 hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 text-xs space-y-1 z-50 animate-fadeIn">
                      <div className="p-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentView('transactions');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 flex items-center space-x-2"
                      >
                        <Receipt className="w-4 h-4 text-blue-600" />
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 font-semibold text-rose-600 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xs:inline">Sign In</span>
                </button>
              )}

              {/* Settings Button */}
              <button
                onClick={() => handleNavClick('settings')}
                className={`p-2.5 rounded-xl border transition-all hidden sm:flex ${
                  currentView === 'settings' 
                    ? 'bg-blue-50 text-blue-600 border-blue-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-slide-left">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Auth Dialog */}
      <AuthModal />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
