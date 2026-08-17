import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Cloud, AlertCircle, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import OAuthConfirmModal from '../components/OAuthConfirmModal';

export default function Login({ onLoginSuccess, showToast }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(null); // 'google' | 'github' | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login({ email, password, rememberMe });
      if (showToast) showToast(`Welcome back, ${user.fullName}!`, 'success');
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      if (showToast) showToast(err.message || 'Invalid login credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSuccess = (user) => {
    if (onLoginSuccess) onLoginSuccess(user);
    navigate('/dashboard');
  };

  return (
    <div className="ambient-glow-bg" style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      {/* Background Orbs */}
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      <div className="glass-card glass-card-shimmer" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--midnight-navy)', color: 'var(--cyber-cyan)', marginBottom: '1rem', boxShadow: 'var(--shadow-glow)' }}>
            <Cloud size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>
            Welcome to ShareVault
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(7, 26, 43, 0.65)', marginTop: '0.3rem' }}>
            Sign in to access your encrypted cloud files
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            padding: '0.8rem 1rem',
            background: 'var(--red-glass)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--red)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Social OAuth Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button type="button" className="btn-social" onClick={() => setOauthProvider('google')}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Google
          </button>

          <button type="button" className="btn-social" onClick={() => setOauthProvider('github')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'rgba(7, 26, 43, 0.4)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(7, 26, 43, 0.1)' }} />
          <span style={{ padding: '0 0.75rem', fontWeight: 600 }}>OR EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(7, 26, 43, 0.1)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--midnight-navy)', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(7, 26, 43, 0.4)' }} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(7, 26, 43, 0.15)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  background: 'var(--white)'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--midnight-navy)' }}>
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowForgotModal(true)}
                style={{ fontSize: '0.8rem', color: 'var(--electric-blue)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(7, 26, 43, 0.4)' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(7, 26, 43, 0.15)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  background: 'var(--white)'
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(7, 26, 43, 0.4)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--midnight-navy)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--electric-blue)', cursor: 'pointer' }}
              />
              Remember my session
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 600 }}>
              <ShieldCheck size={14} /> 256-Bit SSL
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(7, 26, 43, 0.6)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--electric-blue)', fontWeight: 700 }}>
            Register Free Account
          </Link>
        </div>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} showToast={showToast} />
      )}

      {oauthProvider && (
        <OAuthConfirmModal 
          provider={oauthProvider} 
          onClose={() => setOauthProvider(null)} 
          onConfirmSuccess={handleOAuthSuccess}
          showToast={showToast}
        />
      )}
    </div>
  );
}
