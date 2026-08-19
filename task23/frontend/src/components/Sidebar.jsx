import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Search, 
  BarChart3, 
  HelpCircle, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '1.6k' },
    { id: 'customers', label: 'Customers', icon: Users, badge: '550' },
    { id: 'search-intel', label: 'Search Intelligence', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle, highlight: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-[#0F172A]/90 border-r border-slate-800/80 backdrop-blur-xl flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Logo Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  OrderSphere
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-indigo-400/90">
                  Order Intelligence
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white items-center justify-center transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : item.highlight
                    ? 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 border border-indigo-800/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'
                }`} />

                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Educational Card */}
        {!collapsed && (
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900/80 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>SQL Relational JOIN</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Customers & Orders connected via foreign key <code className="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded font-mono">customer_id</code>.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
