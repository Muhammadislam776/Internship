import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Play, ArrowRight, FileCode, CheckCircle2 } from 'lucide-react';
import ApiVisualizer from './ApiVisualizer';

export default function Hero({ onOpenDemoModal }) {
  return (
    <section className="hero-section">
      <div>
        {/* Cybersecurity Tag Badge */}
        <div className="hero-badge">
          <ShieldCheck size={16} />
          <span>VALIDATE FIRST. TRUST EVERY REQUEST.</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title">
          Validate Every Request <br />
          <span className="text-gradient-cyan">Before It Reaches</span> <br />
          Your Database.
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-subtitle">
          ShieldForm demonstrates how Zod schema validation middleware intercepts and sanitizes Express.js requests. Block bad payloads instantly before touching your database logic.
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          <Link to="/validation" className="btn-primary">
            <span>Test Validation Bench</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/docs" className="btn-secondary">
            <FileCode size={18} />
            <span>View API Docs</span>
          </Link>

          <button onClick={onOpenDemoModal} className="btn-secondary btn-orange" style={{ border: 'none' }}>
            <Play size={18} fill="#fff" />
            <span>How Validation Works</span>
          </button>
        </div>

        {/* Micro highlights */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '36px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#22C55E" />
            <span>Express.js Middleware</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#22D3EE" />
            <span>Zod Safe Parsing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#6366F1" />
            <span>Zero Unsanitized Writes</span>
          </div>
        </div>
      </div>

      {/* Right Side API Visualization Card */}
      <div>
        <ApiVisualizer />
      </div>
    </section>
  );
}
