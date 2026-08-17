import React from 'react';
import { Shield, ArrowRight, Lock, Key, Terminal, Zap, CheckCircle2 } from 'lucide-react';
import { HeroWorkflow } from '../components/HeroWorkflow';
import { FlipCards } from '../components/FlipCards';
import { ApiVisualizer } from '../components/ApiVisualizer';
import { HowItWorksModal } from '../components/HowItWorksModal';
import { AuthActivityLog } from '../components/AuthActivityLog';

export const LandingPage = ({ setActivePage }) => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.08) 0%, rgba(248, 250, 252, 1) 70%)',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(7, 26, 43, 0.06)',
              padding: '0.4rem 1rem',
              borderRadius: '2rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #2563EB, #22D3EE)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '0.15rem 0.5rem',
                borderRadius: '1rem',
                letterSpacing: '0.04em'
              }}>
                EXPRESS AUTH MIDDLEWARE
              </span>
              <span style={{ fontSize: '0.85rem', color: '#071A2B', fontWeight: '600' }}>
                Strict Authorization: Bearer &lt;JWT&gt; Verification
              </span>
            </div>

            {/* Hero Main Headline */}
            <h1 style={{
              fontSize: '3.25rem',
              fontWeight: '800',
              color: '#071A2B',
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}>
              Secure Your APIs With <span style={{ color: '#2563EB' }}>JWT Authentication</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.2rem',
              color: '#64748B',
              lineHeight: '1.6',
              marginBottom: '2rem',
              maxWidth: '680px',
              margin: '0 auto 2rem auto'
            }}>
              Protect your Express APIs with secure, reliable and reusable authentication middleware.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActivePage('login')}
                className="btn btn-cta pulse-badge"
                style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', gap: '0.75rem' }}
              >
                <span>Try Authentication</span>
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </button>

              <button
                onClick={() => setActivePage('apiflow')}
                className="btn btn-outline"
                style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', gap: '0.75rem', backgroundColor: '#ffffff' }}
              >
                <Terminal style={{ width: '18px', height: '18px', color: '#2563EB' }} />
                <span>View API Flow</span>
              </button>
            </div>

          </div>

          {/* Hero Visualizer */}
          <HeroWorkflow />
        </div>
      </section>

      {/* 3D Flip Cards Section */}
      <FlipCards />

      {/* Protected API Visualizer Section */}
      <ApiVisualizer />

      {/* How JWT Authentication Works Modal & Banner */}
      <HowItWorksModal />

      {/* Activity Log Section */}
      <section style={{ padding: '3rem 0 5rem 0' }}>
        <div className="container">
          <AuthActivityLog />
        </div>
      </section>
    </div>
  );
};
