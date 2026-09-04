import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Kanban, Sparkles, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('muhammad@flowboard.dev');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      addToast('Welcome back to FlowBoard!', 'success');
      navigate('/dashboard');
    } else {
      addToast(res.message || 'Login failed', 'error');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    addToast('Logged in as Muhammad (Lead Developer)', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-midnight-dark relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber/15 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card rounded-3xl p-8 border border-cyber/30 max-w-md w-full shadow-glass relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-electric via-cyber to-vibrant p-0.5 shadow-blue-glow mb-3">
            <div className="w-full h-full bg-midnight-dark rounded-[14px] flex items-center justify-center">
              <Kanban className="w-7 h-7 text-cyber" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">FlowBoard</h1>
          <p className="text-xs text-cyber font-semibold tracking-wider uppercase mt-1">
            "Plan Better. Move Faster. Get Things Done."
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <button
          onClick={handleDemoLogin}
          className="w-full mb-6 py-3 px-4 bg-gradient-to-r from-vibrant to-amber-500 hover:from-vibrant-hover text-white font-extrabold text-xs rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>Quick Demo Login (as Muhammad)</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-midnight-card px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
            Or Sign In With Email
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-electric hover:bg-electric-hover text-white font-extrabold rounded-2xl shadow-blue-glow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyber font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
