import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Award, LogOut, User, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'organization') return '/org';
    return '/recipient';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CertifyCraft
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              PRO
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/verify"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Certificate</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <Link
                to={getDashboardPath()}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span className="capitalize">{user.role} Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 shadow-md shadow-indigo-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
