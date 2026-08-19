import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    register, 
    authError, 
    authLoading 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
    } catch (err) {
      console.log('Auth error caught');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('alex@payflow.io');
    setPassword('password123');
    await login('alex@payflow.io', 'password123');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative space-y-6 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {authMode === 'login' ? 'Sign In to PayFlow' : 'Create Account'}
              </h3>
              <p className="text-xs text-slate-500">Secure E-Commerce Authentication</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Login Callout */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Fast 1-Click Demo Login</span>
              <span className="text-[10px] text-slate-500">Log in as Alex Morgan (Verified User)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-all"
          >
            Demo Login
          </button>
        </div>

        {/* Error message */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              placeholder="alex@payflow.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-orange-500" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Phone Number</span>
              </label>
              <input
                type="text"
                placeholder="+1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md flex items-center justify-center space-x-2 transition-all mt-2"
          >
            {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}</span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-xs text-slate-500">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => setAuthMode('register')}
                className="font-bold text-blue-600 hover:underline"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => setAuthMode('login')}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
