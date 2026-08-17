import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, ShieldCheck, UserCheck, Play, Copy, Check } from 'lucide-react';

export const ApiVisualizer = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const demoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl85ODc2NSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY3MjU4ODgwMH0.MaskedSignatureSecretKey";

  const runVisualizer = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setCurrentStep(1);

    setTimeout(() => setCurrentStep(2), 700);
    setTimeout(() => setCurrentStep(3), 1400);
    setTimeout(() => setCurrentStep(4), 2100);
    setTimeout(() => setCurrentStep(5), 2800);
    setTimeout(() => {
      setIsExecuting(false);
    }, 3500);
  };

  const copyHeader = () => {
    navigator.clipboard.writeText(`Authorization: Bearer ${demoToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ padding: '4rem 0', background: '#071A2B', color: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            color: '#22D3EE',
            fontSize: '0.8rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            INTERACTIVE HTTP SIMULATOR
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.25rem' }}>
            Protected API Request Inspection
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0.5rem auto 0 auto', fontSize: '0.95rem' }}>
            Simulate a real HTTP request carrying a Bearer JWT through the Express authMiddleware verification stack.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>

          {/* Left Column: Request Inspection */}
          <div style={{
            background: 'rgba(13, 39, 64, 0.7)',
            borderRadius: '1rem',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Terminal style={{ width: '18px', height: '18px', color: '#22D3EE' }} />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>HTTP Header Request Payload</span>
                </div>
                <span style={{
                  background: 'rgba(34, 211, 238, 0.1)',
                  color: '#22D3EE',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.3rem'
                }}>
                  GET METHOD
                </span>
              </div>

              {/* Endpoint Display */}
              <div style={{
                background: '#040d16',
                borderRadius: '0.5rem',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ color: '#22C55E', fontWeight: '700', marginRight: '0.75rem' }}>GET</span>
                  <span style={{ color: '#ffffff' }}>/api/auth/me</span>
                </div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>HTTP/1.1</span>
              </div>

              {/* Authorization Header Box */}
              <div style={{
                background: '#040d16',
                borderRadius: '0.5rem',
                padding: '1rem',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#22D3EE', fontWeight: '700', letterSpacing: '0.05em' }}>
                    AUTHORIZATION HEADER
                  </span>
                  <button 
                    onClick={copyHeader}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}
                  >
                    {copied ? <Check style={{ width: '12px', height: '12px', color: '#22C55E' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#E2E8F0', wordBreak: 'break-all', lineHeight: '1.5' }}>
                  <span style={{ color: '#FF7A18', fontWeight: '700' }}>Bearer </span>
                  <span style={{ color: '#94A3B8' }}>{demoToken}</span>
                </div>
              </div>
            </div>

            <button
              onClick={runVisualizer}
              disabled={isExecuting}
              className="btn btn-cta"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Play style={{ width: '16px', height: '16px' }} />
              <span>{isExecuting ? 'Processing Verification Pipeline...' : 'Test Bearer Verification Flow'}</span>
            </button>
          </div>

          {/* Right Column: Execution Step Nodes */}
          <div style={{
            background: 'rgba(13, 39, 64, 0.7)',
            borderRadius: '1rem',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <h4 style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem', marginBottom: '1.25rem' }}>
              authMiddleware Pipeline Execution
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Step 1: REQUEST */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.6rem',
                background: currentStep >= 1 ? 'rgba(37, 99, 235, 0.2)' : 'rgba(7, 26, 43, 0.4)',
                border: currentStep >= 1 ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 1 ? '#2563EB' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <Send style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: currentStep >= 1 ? '#ffffff' : '#64748B' }}>1. REQUEST</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>HTTP client dispatches Bearer token</div>
                </div>
              </div>

              {/* Step 2: AUTH MIDDLEWARE */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.6rem',
                background: currentStep >= 2 ? 'rgba(34, 211, 238, 0.2)' : 'rgba(7, 26, 43, 0.4)',
                border: currentStep >= 2 ? '1px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 2 ? '#22D3EE' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentStep >= 2 ? '#071A2B' : '#ffffff' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: currentStep >= 2 ? '#ffffff' : '#64748B' }}>2. AUTH MIDDLEWARE</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Header extracted & scheme checked</div>
                </div>
              </div>

              {/* Step 3: JWT VERIFY */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.6rem',
                background: currentStep >= 3 ? 'rgba(34, 211, 238, 0.2)' : 'rgba(7, 26, 43, 0.4)',
                border: currentStep >= 3 ? '1px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 3 ? '#22D3EE' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentStep >= 3 ? '#071A2B' : '#ffffff' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: currentStep >= 3 ? '#ffffff' : '#64748B' }}>3. JWT VERIFY</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>jwt.verify(token, process.env.JWT_SECRET)</div>
                </div>
              </div>

              {/* Step 4: USER IDENTIFIED */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.6rem',
                background: currentStep >= 4 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(7, 26, 43, 0.4)',
                border: currentStep >= 4 ? '1px solid #22C55E' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 4 ? '#22C55E' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <UserCheck style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: currentStep >= 4 ? '#ffffff' : '#64748B' }}>4. USER IDENTIFIED</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>req.user populated & next() called</div>
                </div>
              </div>

              {/* Step 5: API RESPONSE */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.6rem',
                background: currentStep >= 5 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(7, 26, 43, 0.4)',
                border: currentStep >= 5 ? '2px solid #22C55E' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 5 ? '#22C55E' : '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: currentStep >= 5 ? '#ffffff' : '#64748B' }}>5. API RESPONSE</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>HTTP 200 OK returned with user JSON payload</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
