import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Mail, Key, Lock, Activity, CheckCircle2, Copy, LogOut, Terminal, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserActivity } from '../services/api';
import { SecurityStatusCard } from '../components/SecurityStatusCard';
import { ApiTester } from '../components/ApiTester';
import { AuthActivityLog } from '../components/AuthActivityLog';

export const DashboardPage = ({ setActivePage }) => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [copied, setCopied] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProtectedProfile();
    }
  }, [isAuthenticated]);

  const fetchProtectedProfile = async () => {
    setFetching(true);
    const profRes = await getUserProfile();
    if (profRes.ok && profRes.data.success) {
      setProfileData(profRes.data.profile);
    }
    const actRes = await getUserActivity();
    if (actRes.ok && actRes.data.success) {
      setActivities(actRes.data.activity);
    }
    setFetching(false);
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Decode JWT payload helper
  const decodeJwtPayload = (tokenStr) => {
    if (!tokenStr) return null;
    try {
      const parts = tokenStr.split('.');
      if (parts.length !== 3) return null;
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(payloadBase64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const decodedPayload = decodeJwtPayload(token);

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: '#F8FAFC'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '1.25rem',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <ShieldAlert style={{ width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#071A2B' }}>
            Protected Route — Authentication Required
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.75rem' }}>
            Express authMiddleware blocked your request to <code style={{ color: '#2563EB', background: '#F1F5F9', padding: '0.2rem 0.4rem', borderRadius: '0.2rem' }}>/dashboard</code>. No valid Authorization: Bearer token found.
          </p>

          <button
            onClick={() => setActivePage('login')}
            className="btn btn-cta pulse-badge"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            <Lock style={{ width: '16px', height: '16px' }} />
            <span>Sign In to Access Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{
          background: '#071A2B',
          borderRadius: '1.25rem',
          padding: '2.25rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22C55E',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                padding: '0.25rem 0.65rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
                <span>🟢 Authenticated</span>
              </span>
              <span style={{ color: '#22D3EE', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                Session: Active
              </span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Welcome, {user?.name || 'Developer'}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              User Email: <span style={{ color: '#ffffff', fontWeight: '600' }}>{user?.email}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={fetchProtectedProfile}
              className="btn btn-outline-cyan"
              style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            >
              Refresh Token State
            </button>

            <button
              onClick={logout}
              className="btn"
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid 1: Status & Token Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Security Status Card */}
          <SecurityStatusCard user={user} token={token} />

          {/* Live JWT Inspection Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '1.25rem',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key style={{ width: '20px', height: '20px', color: '#2563EB' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#071A2B' }}>Active Bearer JWT Token</h3>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#22C55E', background: 'rgba(34, 197, 94, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>
                  JWT Status: Valid
                </span>
              </div>

              {/* Raw Token Preview */}
              <div style={{
                background: '#071A2B',
                borderRadius: '0.65rem',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                color: '#22D3EE',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                lineHeight: '1.5',
                maxHeight: '80px',
                overflowY: 'auto'
              }}>
                <span style={{ color: '#FF7A18', fontWeight: '700' }}>Bearer </span>
                {token}
              </div>

              <button
                onClick={copyToken}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', marginBottom: '1.25rem' }}
              >
                <Copy style={{ width: '14px', height: '14px' }} />
                <span>{copied ? 'Token Copied to Clipboard!' : 'Copy JWT Bearer Token'}</span>
              </button>

              {/* Decoded Payload */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  DECODED PAYLOAD (JWT.VERIFY)
                </h4>
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#071A2B'
                }}>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(decodedPayload || { id: user?.id, email: user?.email, iat: 'Timestamp', exp: '24 Hours' }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Grid 2: Interactive Sandbox Tester */}
        <div style={{ marginBottom: '2rem' }}>
          <ApiTester />
        </div>

        {/* Dashboard Grid 3: Activity Log */}
        <div>
          <AuthActivityLog activities={activities} />
        </div>

      </div>
    </div>
  );
};
