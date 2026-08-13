import React from 'react';
import { ShieldCheck, Heart, Github, Code, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
              <ShieldCheck size={24} color="#22D3EE" />
              <span>Shield<span className="text-gradient-cyan">Form</span></span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Validate First. Trust Every Request. Commercial-grade schema validation middleware platform powered by Express.js and Zod.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Tech Architecture</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#22C55E" /> Express.js Middleware</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#22D3EE" /> Zod v3 Schema Validation</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#6366F1" /> React + Vite Frontend</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FF7A18" /> Lucide React Security Icons</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>API Endpoints</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><code>POST /api/users</code> (validateUser)</li>
              <li><code>GET /api/users</code> (Validated list)</li>
              <li><code>GET /api/stats</code> (Live analytics)</li>
              <li><code>GET /api/logs</code> (Middleware audit)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Platform Status</h4>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.82rem',
              color: '#22C55E',
              fontWeight: 700
            }}>
              ● All Systems Operational<br/>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 400 }}>Zero unsanitized requests permitted</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem' }}>
          <div>
            © {new Date().getFullYear()} ShieldForm Security Platform. Built for robust Express & Zod integration.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#22D3EE' }}>Middleware Status: Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
