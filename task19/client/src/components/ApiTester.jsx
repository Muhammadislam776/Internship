import React, { useState } from 'react';
import { Terminal, Play, AlertTriangle, CheckCircle2, ShieldAlert, Key, Send, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ApiTester = () => {
  const { token } = useAuth();
  const [testScenario, setTestScenario] = useState('valid');
  const [customHeader, setCustomHeader] = useState('');
  const [responseState, setResponseState] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      id: 'valid',
      name: '1. Valid Bearer Token',
      description: 'Sends real valid JWT token in Authorization: Bearer header.',
      expected: '200 OK — req.user populated & user returned'
    },
    {
      id: 'missing',
      name: '2. Missing Header',
      description: 'Omits the Authorization header completely.',
      expected: '401 Unauthorized — "Authentication token is required."'
    },
    {
      id: 'malformed',
      name: '3. Malformed Header (No Bearer)',
      description: 'Sends Authorization: Token <jwt> without Bearer scheme.',
      expected: '401 Unauthorized — "Invalid authorization format."'
    },
    {
      id: 'invalid',
      name: '4. Invalid/Expired Token',
      description: 'Sends Authorization: Bearer invalid_signature_token.',
      expected: '401 Unauthorized — "Invalid or expired token."'
    }
  ];

  const handleRunTest = async () => {
    setLoading(true);
    setResponseState(null);

    const startTime = performance.now();
    let authHeaderValue = null;

    if (testScenario === 'valid') {
      authHeaderValue = token ? `Bearer ${token}` : `Bearer eyJhbGciOiJIUzI1Ni...demo`;
    } else if (testScenario === 'missing') {
      authHeaderValue = null;
    } else if (testScenario === 'malformed') {
      authHeaderValue = `Basic ${token || 'token_sample'}`;
    } else if (testScenario === 'invalid') {
      authHeaderValue = `Bearer bad.jwt.token_signature_invalid`;
    } else if (testScenario === 'custom') {
      authHeaderValue = customHeader;
    }

    const headers = {
      'Content-Type': 'application/json'
    };
    if (authHeaderValue !== null && authHeaderValue !== '') {
      headers['Authorization'] = authHeaderValue;
    }

    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers
      });

      const data = await res.json().catch(() => ({ message: 'Raw non-JSON response' }));
      const duration = Math.round(performance.now() - startTime);

      setResponseState({
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        data,
        duration,
        headerSent: authHeaderValue || '(None)'
      });
    } catch (err) {
      setResponseState({
        status: 500,
        statusText: 'Network Error',
        ok: false,
        data: { success: false, message: err.message },
        duration: 0,
        headerSent: authHeaderValue || '(None)'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#071A2B',
      borderRadius: '1.25rem',
      padding: '2rem',
      color: '#ffffff',
      border: '1px solid rgba(34, 211, 238, 0.3)',
      boxShadow: '0 20px 40px rgba(7, 26, 43, 0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Terminal style={{ width: '20px', height: '20px', color: '#22D3EE' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>authMiddleware Sandbox Tester</h3>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
            Execute real HTTP GET requests against /api/auth/me to test Express authMiddleware response behavior.
          </p>
        </div>

        <button
          onClick={handleRunTest}
          disabled={loading}
          className="btn btn-cta"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
        >
          {loading ? (
            <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Play style={{ width: '16px', height: '16px' }} />
          )}
          <span>{loading ? 'Testing...' : 'Execute Test Request'}</span>
        </button>
      </div>

      {/* Test Scenarios Preset Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.5rem'
      }}>
        {presets.map((preset) => {
          const isSelected = testScenario === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => setTestScenario(preset.id)}
              style={{
                background: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(13, 39, 64, 0.6)',
                border: isSelected ? '2px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: isSelected ? '#ffffff' : '#CBD5E1', marginBottom: '0.2rem' }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: '1.4' }}>
                {preset.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Response Panel */}
      {responseState && (
        <div style={{
          background: '#040d16',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          border: `1px solid ${responseState.ok ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                background: responseState.ok ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: responseState.ok ? '#22C55E' : '#EF4444',
                fontWeight: '800',
                padding: '0.25rem 0.6rem',
                borderRadius: '0.3rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}>
                HTTP {responseState.status} {responseState.statusText}
              </span>
              <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                Latency: <span style={{ color: '#22D3EE', fontFamily: 'var(--font-mono)' }}>{responseState.duration}ms</span>
              </span>
            </div>

            <span style={{ color: '#64748B', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              Header Sent: {responseState.headerSent.substring(0, 35)}...
            </span>
          </div>

          <div style={{
            background: '#071018',
            borderRadius: '0.5rem',
            padding: '0.85rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: responseState.ok ? '#86EFAC' : '#FCA5A5',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(responseState.data, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
};
