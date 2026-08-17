import React, { useState } from 'react';
import { X, Mail, CheckCircle2, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';

export default function ForgotPasswordModal({ onClose, showToast }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      await authService.resetPassword(email.trim());
      setSubmitted(true);
      if (showToast) showToast('Password reset link sent to your email!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={20} color="var(--vibrant-orange)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--midnight-navy)' }}>
              Reset Password
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '0.88rem', color: 'rgba(7, 26, 43, 0.65)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Enter your registered email address and we'll send you instructions to safely reset your password.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={48} color="var(--emerald)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Check Your Email</h4>
            <p style={{ fontSize: '0.88rem', color: 'rgba(7, 26, 43, 0.7)', marginBottom: '1.5rem' }}>
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
