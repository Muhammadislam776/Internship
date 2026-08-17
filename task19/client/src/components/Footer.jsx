import React from 'react';
import { Shield, Key, Lock, Terminal, Cpu, CheckCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#071A2B', color: '#94A3B8', borderTop: '1px solid rgba(34, 211, 238, 0.15)', paddingTop: '4rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)',
                padding: '0.4rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Shield style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>SecureGate</span>
            </div>
            <p style={{ color: '#22D3EE', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              "Secure Every Request. Protect Every Route."
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.6' }}>
              Production-grade Express authMiddleware implementation verifying Bearer JWT tokens, protecting API endpoints, and managing secure user sessions.
            </p>
          </div>

          {/* Col 2: Core Middleware Spec */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '0.03em' }}>
              MIDDLEWARE ARCHITECTURE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle style={{ width: '14px', height: '14px', color: '#22D3EE' }} />
                <span>Authorization: Bearer &lt;JWT&gt;</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle style={{ width: '14px', height: '14px', color: '#22D3EE' }} />
                <span>jwt.verify(token, process.env.JWT_SECRET)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle style={{ width: '14px', height: '14px', color: '#22D3EE' }} />
                <span>req.user Object Context Injection</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle style={{ width: '14px', height: '14px', color: '#22D3EE' }} />
                <span>Strict HTTP 401 Error Handling</span>
              </li>
            </ul>
          </div>

          {/* Col 3: API Endpoints */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '0.03em' }}>
              API ENDPOINTS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              <li style={{ color: '#22C55E' }}>POST /api/auth/register</li>
              <li style={{ color: '#22C55E' }}>POST /api/auth/login</li>
              <li style={{ color: '#22D3EE' }}>GET /api/auth/me (Protected)</li>
              <li style={{ color: '#22D3EE' }}>GET /api/users/profile (Protected)</li>
            </ul>
          </div>

          {/* Col 4: Security Features */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '0.03em' }}>
              SECURITY STANDARD
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1rem' }}>
              Built following OWASP API Security top guidelines with salted bcrypt password hashing and env secret storage.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              padding: '0.4rem 0.8rem',
              borderRadius: '0.4rem',
              fontSize: '0.75rem',
              color: '#22D3EE'
            }}>
              <Lock style={{ width: '12px', height: '12px' }} />
              <span>JWT Secret: process.env.JWT_SECRET</span>
            </div>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          paddingTop: '1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} SecureGate Security SaaS Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Express authMiddleware Engine</span>
            <span>JWT Security Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
