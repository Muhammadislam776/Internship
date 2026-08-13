import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Database, Server, CheckCircle2 } from 'lucide-react';
import { checkHealth } from '../services/api';

export const SecurityCard = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22C55E'
        }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>Security & Storage</h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Infrastructure protection status</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Profile Protected */}
        <div style={{ background: 'rgba(7, 26, 43, 0.6)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#22D3EE', fontSize: '0.85rem', fontWeight: 700 }}>
            <Lock size={15} /> Profile Protected
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Strict backend MIME & size authorization.</p>
        </div>

        {/* Secure Storage */}
        <div style={{ background: 'rgba(7, 26, 43, 0.6)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#FFB86B', fontSize: '0.85rem', fontWeight: 700 }}>
            <Database size={15} /> Supabase Storage
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Bucket: <code>profile-pictures</code></p>
        </div>

        {/* Encrypted Connection */}
        <div style={{ background: 'rgba(7, 26, 43, 0.6)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#22C55E', fontSize: '0.85rem', fontWeight: 700 }}>
            <ShieldCheck size={15} /> Credential Isolation
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Service Role Key backend-only.</p>
        </div>

        {/* API Status */}
        <div style={{ background: 'rgba(7, 26, 43, 0.6)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700 }}>
            <Server size={15} color="#FF7A18" /> Express API Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: apiStatus === 'online' ? '#22C55E' : '#FF7A18' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: apiStatus === 'online' ? '#22C55E' : '#FF7A18', display: 'inline-block' }}></span>
            {apiStatus === 'online' ? 'Online & Ready (Port 5000)' : 'Checking Backend...'}
          </div>
        </div>

      </div>
    </div>
  );
};
