import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Zap, Menu, X, Activity, User, ShieldCheck } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { eventEngine } from '../services/eventEngine';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(eventEngine.getEvents());
    const unsubscribe = eventEngine.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
    });
    return unsubscribe;
  }, []);

  const unreadCount = events.filter(e => e.status === 'SENT' || e.status === 'FAILED').length;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Events', path: '/events' },
    { name: 'Emails', path: '/emails' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'API Docs', path: '/api-docs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#2563EB]/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-heading text-xl font-bold text-white tracking-tight">
              Notify<span className="text-[#22D3EE]">Flow</span>
            </div>
            <div className="text-[10px] text-[#94A3B8] tracking-wide font-mono uppercase font-medium">
              Event Dispatcher
            </div>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#071A2B]/60 p-1.5 rounded-full border border-[#22D3EE]/20 backdrop-blur-md">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/40'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          
          {/* Connection Status Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#071A2B] border border-[#22D3EE]/30 px-3 py-1.5 rounded-full text-xs font-mono text-[#22D3EE]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
            </span>
            <span className="text-white text-[11px] font-semibold">Live Engine</span>
          </div>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl bg-[#071A2B] border border-[#22D3EE]/20 text-[#22D3EE] hover:text-white hover:border-[#22D3EE]/60 transition-all cursor-pointer shadow-sm"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF7A18] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#071A2B] animate-bounce shadow-md">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Center Dropdown */}
            {notificationsOpen && (
              <NotificationCenter
                events={events}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
          </div>

          {/* Profile Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#FF7A18] p-0.5">
              <div className="w-full h-full rounded-full bg-[#071A2B] flex items-center justify-center">
                <User className="w-4 h-4 text-[#22D3EE]" />
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#071A2B] border border-white/10 text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#071A2B]/95 backdrop-blur-xl border-b border-[#22D3EE]/20 p-6 flex flex-col gap-3 shadow-2xl transition-all">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
              Edge Engine Online
            </span>
            <span className="font-mono text-[#22D3EE]">v2.4.0</span>
          </div>
        </div>
      )}
    </header>
  );
}
