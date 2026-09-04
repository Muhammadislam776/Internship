import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  LayoutTemplate,
  Award,
  Users,
  FileClock,
  ShieldCheck,
  BarChart3,
  Building2,
  PenTool,
  Settings,
  HelpCircle,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const OrgLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Full-screen canvas designer mode (hide header/sidebar for maximum studio space)
  const isDesignerPage = location.pathname.includes('/org/designer');
  if (isDesignerPage) {
    return <Outlet />;
  }

  const mainNav = [
    { path: '/org', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/org/designer', label: 'Create Certificate', icon: PlusCircle, isCta: true },
    { path: '/org/templates', label: 'Templates', icon: LayoutTemplate },
    { path: '/org/issued', label: 'Certificates', icon: Award },
    { path: '/org/recipients', label: 'Recipients', icon: Users }
  ];

  const mgmtNav = [
    { path: '/org/drafts', label: 'Drafts', icon: FileClock },
    { path: '/org/verification', label: 'Verification', icon: ShieldCheck },
    { path: '/org/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const orgNav = [
    { path: '/org/profile', label: 'Organization Profile', icon: Building2 },
    { path: '/org/branding', label: 'Signatures & Branding', icon: PenTool },
    { path: '/org/settings', label: 'Settings', icon: Settings }
  ];

  const getPageTitle = () => {
    const current = [...mainNav, ...mgmtNav, ...orgNav].find((n) => n.path === location.pathname);
    return current ? current.label : 'Organization Issuer Portal';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        {/* Left Title & Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>{getPageTitle()}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
                Issuer Portal
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 flex items-center space-x-1 font-medium">
              <span>Organization</span>
              <span>/</span>
              <span className="text-blue-600 font-semibold">{getPageTitle()}</span>
            </p>
          </div>
        </div>

        {/* Right Search & Actions */}
        <div className="flex items-center space-x-3">
          {/* Global Search Input */}
          <div className="hidden md:flex items-center relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search issued certs, recipients..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Create Certificate Orange CTA */}
          <Link
            to="/org/designer"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Certificate</span>
          </Link>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white animate-pulse" />
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Issuer Notifications</h4>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">New</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                  <div className="p-2 rounded-xl bg-blue-50/60 text-xs space-y-0.5 border border-blue-100">
                    <p className="font-bold text-blue-900">Certificate Verified</p>
                    <p className="text-[11px] text-slate-600">CERT-2026-953577 scanned successfully.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 text-xs space-y-0.5">
                    <p className="font-bold text-slate-800">Draft Saved</p>
                    <p className="text-[11px] text-slate-500">Canva Modern Blue draft ready.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Organization User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
                {user?.name?.charAt(0) || 'O'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                  {user?.name || 'Tech Academy'}
                </p>
                <p className="text-[10px] font-semibold text-orange-600 mt-0.5">Authorized Issuer</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1">
                <Link
                  to="/org/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Org Profile</span>
                </Link>
                <Link
                  to="/org/branding"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Signatures & Branding</span>
                </Link>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Collapsible Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shrink-0 shadow-sm z-20`}
        >
          {/* Logo Header */}
          <div className="h-16 flex items-center px-5 border-b border-slate-100 space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-orange-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 leading-none tracking-tight">
                  Certificate <span className="text-orange-500">Maker</span>
                </h2>
                <p className="text-[9px] font-semibold text-blue-600 uppercase tracking-widest mt-0.5 truncate">
                  {user?.name || 'Issuer Portal'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* MAIN GROUP */}
            <div className="space-y-1">
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Main Overview
                </p>
              )}
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      item.isCta
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-md shadow-orange-500/20 hover:brightness-110 my-2'
                        : isActive
                        ? 'bg-blue-50 text-blue-700 font-extrabold border-r-4 border-orange-500 shadow-sm'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${item.isCta ? 'text-white' : isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            {/* MANAGEMENT GROUP */}
            <div className="space-y-1 border-t border-slate-100 pt-4">
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Management
                </p>
              )}
              {mgmtNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-extrabold border-r-4 border-orange-500 shadow-sm'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            {/* ORGANIZATION GROUP */}
            <div className="space-y-1 border-t border-slate-100 pt-4">
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Organization
                </p>
              )}
              {orgNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-extrabold border-r-4 border-orange-500 shadow-sm'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
            <Link
              to="/org/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-white transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              {sidebarOpen && <span>Help & Support</span>}
            </Link>

            <div className="flex items-center space-x-3 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || 'O'}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Tech Academy'}</p>
                  <p className="text-[10px] font-semibold text-orange-600 truncate">Issuer Account</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content View Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
