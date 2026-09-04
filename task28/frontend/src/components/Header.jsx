import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Kanban, 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Plus, 
  Search, 
  Menu, 
  X, 
  User,
  LogOut,
  Sparkles,
  Users
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../context/AuthContext';

const Header = ({ onOpenCreateTask, searchQuery, setSearchQuery }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loginAsDemo } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Board', path: '/board', icon: Kanban },
    { name: 'My Tasks', path: '/my-tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-header h-16 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-3 xl:gap-6 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-electric via-cyber to-vibrant p-0.5 shadow-blue-glow group-hover:shadow-cyan-glow transition-all duration-300">
              <div className="w-full h-full bg-midnight-dark rounded-[10px] flex items-center justify-center">
                <Kanban className="w-4 h-4 sm:w-5 sm:h-5 text-cyber group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyber bg-clip-text text-transparent">
                FlowBoard
              </span>
              <span className="text-[9px] font-semibold text-cyber tracking-wider uppercase -mt-1 hidden sm:block">
                SaaS Productivity
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Compact & Scalable */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-electric/20 text-cyber border border-cyber/30 shadow-cyan-glow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyber' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Global Search Bar */}
          <div className="relative hidden md:block w-36 lg:w-48 xl:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-midnight/80 border border-midnight-border rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyber focus:ring-1 focus:ring-cyber transition-all"
            />
          </div>

          {/* Notification Center */}
          <NotificationCenter />

          {/* Attractive Quick Add Task Button */}
          <button
            onClick={onOpenCreateTask}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-vibrant via-amber-500 to-vibrant hover:from-vibrant-hover hover:to-amber-600 text-white text-xs font-extrabold rounded-xl shadow-orange-glow hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 border border-amber-400/30"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="inline">New Task</span>
          </button>

          {/* Profile / Demo Auth Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full border border-cyber/20 hover:border-cyber transition-all focus:outline-none"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name || 'User Avatar'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-cyber/30"
              />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-glass p-2 border border-cyber/20 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Muhammad'}</p>
                  <p className="text-[11px] text-cyber font-medium truncate">{user?.email || 'muhammad@flowboard.dev'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-electric/20 text-electric border border-electric/30 rounded-md">
                    {user?.role || 'Lead Developer'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    loginAsDemo();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-cyber hover:bg-cyber/10 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-cyber" />
                  Switch to Demo User
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-status-danger hover:bg-status-danger/10 rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button - Visible on Mobile/Tablet/Laptop */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sliding Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-16 bg-midnight-dark/95 backdrop-blur-2xl border-b border-cyber/20 shadow-glass p-4 animate-slide-down z-50">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-4 py-2 bg-midnight border border-midnight-border rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyber"
            />
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-electric/20 text-cyber border border-cyber/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-cyber' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
