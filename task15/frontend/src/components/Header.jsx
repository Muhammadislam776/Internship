import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Users as UsersIcon, 
  BarChart3, 
  Activity, 
  FileText, 
  Settings as SettingsIcon,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';

export const Header = ({ 
  activeTab, 
  setActiveTab, 
  apiHealth, 
  onSearchFocus,
  onShowToast 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: UsersIcon, badge: 'LIVE' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-header-scrolled py-2.5 shadow-2xl' : 'glass-header py-3.5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: Clean Brand & Sleek Logo Only */}
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0" 
            onClick={() => setActiveTab('dashboard')}
          >
            {/* New Ultra-Attractive Glowing Logo */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#22D3EE] to-[#FF7A18] p-0.5 shadow-lg shadow-[#22D3EE]/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#071A2B] rounded-[14px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#22D3EE] fill-[#22D3EE]/20 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF7A18] rounded-full ring-2 ring-[#071A2B] animate-pulse" />
            </div>

            {/* ONLY Brand Name - No v2.4 PRO badge, No subtitle description */}
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#22D3EE] transition-colors">
              Admin<span className="text-[#22D3EE]">Sphere</span>
            </span>
          </div>

          {/* CENTER: Sequence-Aligned Navbar Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#071A2B]/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#0B253A] text-white shadow-md shadow-[#2563EB]/40 border border-[#22D3EE]/50'
                      : 'text-[#9FB0C2] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#22D3EE] animate-pulse' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] bg-[#FF7A18] text-white font-bold rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FF7A18] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Search, Live Status, Notifications & Profile Avatar (Fully visible & aligned) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onSearchFocus}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs text-[#9FB0C2] hover:text-white hover:border-[#22D3EE]/50 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span className="hidden xl:inline">Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-[#9FB0C2] font-mono">⌘K</kbd>
            </button>

            {/* Live API Status Pill */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0B253A]/90 border border-[#22D3EE]/40 text-[11px] font-mono cursor-pointer hover:border-[#22D3EE] transition-all"
              onClick={() => onShowToast && onShowToast({ title: 'API Connection', message: 'Express Server connected to Supabase Auth API', type: 'info' })}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              <span className="text-[#22D3EE] font-semibold hidden sm:inline">Live API</span>
              <span className="text-white font-bold">{apiHealth?.responseTime ? `${apiHealth.responseTime}ms` : '200 OK'}</span>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2 rounded-xl glass-card text-[#9FB0C2] hover:text-white hover:border-[#22D3EE]/40 transition-all flex items-center justify-center"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF7A18] rounded-full ring-2 ring-[#071A2B] animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF7A18] rounded-full ring-2 ring-[#071A2B]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel p-4 shadow-2xl border border-[#22D3EE]/40 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-semibold text-xs text-white">Notifications</h4>
                    <span className="text-[10px] text-[#22D3EE] font-mono">3 new</span>
                  </div>
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Express Backend Live</span>
                        <span className="text-[10px] text-[#9FB0C2]">Just now</span>
                      </div>
                      <p className="text-[11px] text-[#9FB0C2] mt-1">Supabase Service Role SDK initialized server-side.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#FFB86B]">New User Registration</span>
                        <span className="text-[10px] text-[#9FB0C2]">2m ago</span>
                      </div>
                      <p className="text-[11px] text-[#9FB0C2] mt-1">Dr. Evelyn Vance joined Lumina Tech cluster.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown (Fully visible, not cut off!) */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full glass-card hover:border-[#22D3EE]/50 transition-all cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                    alt="Admin Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#22D3EE] shadow-md shadow-[#22D3EE]/30" 
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] rounded-full ring-2 ring-[#071A2B]" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white leading-none">Alex Vance</p>
                  <p className="text-[9px] text-[#FFB86B] font-mono mt-0.5">Super Admin</p>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel p-3 shadow-2xl border border-[#22D3EE]/40 z-50 animate-fade-in space-y-2">
                  <div className="p-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white">Alex Vance</p>
                    <p className="text-[10px] text-[#9FB0C2] font-mono">alex.vance@enterprise.io</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-[#22D3EE]" />
                    <span>Security Settings</span>
                  </button>
                  <button 
                    onClick={() => {
                      onShowToast && onShowToast({ title: 'Session Ended', message: 'Logged out safely from AdminSphere', type: 'warning' });
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Session</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl glass-card text-white hover:text-[#22D3EE] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative ml-auto w-4/5 max-w-sm bg-[#071A2B] border-l border-[#22D3EE]/30 h-full p-6 shadow-2xl flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-extrabold text-lg text-white">Admin<span className="text-[#22D3EE]">Sphere</span></span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/5 text-[#9FB0C2] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-2">
                <p className="text-[11px] font-bold text-[#9FB0C2] tracking-wider uppercase px-3">Navigation</p>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#0B253A] text-white border border-[#22D3EE]/40' 
                          : 'text-[#9FB0C2] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : ''}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9FB0C2]" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Admin" 
                  className="w-10 h-10 rounded-full border-2 border-[#22D3EE]" 
                />
                <div>
                  <p className="text-sm font-bold text-white">Alex Vance</p>
                  <p className="text-xs text-[#FFB86B]">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
