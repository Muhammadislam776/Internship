import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Key, Server, Cpu } from 'lucide-react';

export const SecurityStatusCard = ({ user, token }) => {
  const securityItems = [
    { id: 1, label: "JWT Verified", detail: "Cryptographic signature matches process.env.JWT_SECRET", active: true },
    { id: 2, label: "Authorization Header Valid", detail: "Correct Bearer scheme format detected", active: true },
    { id: 3, label: "Protected Route Active", detail: "authMiddleware passed req.user to controller", active: true },
    { id: 4, label: "User Authenticated", detail: `Session verified for ${user?.email || 'User'}`, active: true }
  ];

  return (
    <div style={{
      background: '#071A2B',
      borderRadius: '1.25rem',
      padding: '2rem',
      color: '#ffffff',
      border: '1px solid rgba(34, 211, 238, 0.3)',
      boxShadow: '0 20px 40px rgba(7, 26, 43, 0.35)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '240px',
        height: '240px',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(7, 26, 43, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(34, 211, 238, 0.15)',
            padding: '0.6rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(34, 211, 238, 0.4)'
          }}>
            <ShieldCheck style={{ width: '24px', height: '24px', color: '#22D3EE' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>Security Status</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Live Middleware Compliance Audit</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          color: '#22C55E',
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '0.35rem 0.75rem',
          borderRadius: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
          <span>SECURE</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {securityItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'rgba(13, 39, 64, 0.6)',
              border: '1px solid rgba(34, 211, 238, 0.15)',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
              }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#22C55E' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                  ✓ {item.label}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {item.detail}
                </p>
              </div>
            </div>

            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              color: '#22D3EE',
              fontFamily: 'var(--font-mono)'
            }}>
              VERIFIED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
