import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';

export default function OAuthConfirmModal({ provider = 'google', onClose, onConfirmSuccess, showToast }) {
  const isGoogle = provider === 'google';
  const providerName = isGoogle ? 'Google' : 'GitHub';
  const [email, setEmail] = useState(isGoogle ? 'alex.morgan@gmail.com' : 'alex.morgan@github.com');
  const [fullName, setFullName] = useState('Alex Morgan');
  const [loading, setLoading] = useState(false);

  const handleAuthorize = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      const user = await authService.confirmOAuthLogin(provider, email.trim(), fullName.trim());
      if (showToast) showToast(`Successfully authorized via ${providerName}!`, 'success');
      onConfirmSuccess(user);
      onClose();
    } catch (err) {
      if (showToast) showToast(`Authorization failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* OAuth Header Bar */}
        <div style={{
          background: isGoogle ? '#FFFFFF' : '#181717',
          color: isGoogle ? '#202124' : '#FFFFFF',
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isGoogle ? (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Authorize {providerName} Account</h3>
              <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>ShareVault Single Sign-On Consent</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ color: isGoogle ? '#202124' : '#FFFFFF' }}>
            <X size={18} />
          </button>
        </div>

        {/* OAuth Body */}
        <form onSubmit={handleAuthorize} style={{ padding: '1.75rem' }}>
          <div style={{
            background: 'var(--soft-white)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            border: '1px solid rgba(7, 26, 43, 0.08)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(7,26,43,0.5)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Confirm Account Details
            </div>

            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--midnight-navy)' }}>
                Account Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(7, 26, 43, 0.15)',
                  fontSize: '0.85rem',
                  marginTop: '0.2rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--midnight-navy)' }}>
                Display Name
              </label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(7, 26, 43, 0.15)',
                  fontSize: '0.85rem',
                  marginTop: '0.2rem'
                }}
              />
            </div>
          </div>

          {/* Scope permissions requested */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--midnight-navy)', marginBottom: '0.6rem' }}>
              ShareVault will receive the following permissions:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'rgba(7, 26, 43, 0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="var(--emerald)" /> View primary email address
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="var(--emerald)" /> View basic account profile & avatar
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="var(--cyber-cyan)" /> Authenticate session for cloud storage access
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ gap: '0.5rem' }}>
              {loading ? 'Authorizing...' : 'Confirm & Grant Access'} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
