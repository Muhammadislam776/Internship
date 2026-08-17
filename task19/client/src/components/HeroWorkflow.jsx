import React, { useState, useEffect } from 'react';
import { UserCheck, Key, Send, ShieldCheck, CheckCircle2, Database, Play, RefreshCw } from 'lucide-react';

export const HeroWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      id: 1,
      title: "LOGIN",
      subtitle: "Email & Password",
      icon: UserCheck,
      color: "#2563EB",
      code: "POST /api/auth/login"
    },
    {
      id: 2,
      title: "JWT CREATED",
      subtitle: "Signed with Secret",
      icon: Key,
      color: "#22D3EE",
      code: "jwt.sign({ id }, SECRET)"
    },
    {
      id: 3,
      title: "REQUEST",
      subtitle: "Bearer Header",
      icon: Send,
      color: "#FF7A18",
      code: "Authorization: Bearer <JWT>"
    },
    {
      id: 4,
      title: "AUTH MIDDLEWARE",
      subtitle: "Extract & Verify",
      icon: ShieldCheck,
      color: "#2563EB",
      code: "authMiddleware(req, res, next)"
    },
    {
      id: 5,
      title: "VERIFIED",
      subtitle: "req.user Attached",
      icon: CheckCircle2,
      color: "#22C55E",
      code: "req.user = decodedUser"
    },
    {
      id: 6,
      title: "PROTECTED API",
      subtitle: "Response Delivered",
      icon: Database,
      color: "#22D3EE",
      code: "200 OK + User Data"
    }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  return (
    <div style={{
      background: 'rgba(7, 26, 43, 0.95)',
      borderRadius: '1.25rem',
      padding: '2.5rem 1.5rem',
      border: '1px solid rgba(34, 211, 238, 0.3)',
      boxShadow: '0 20px 40px rgba(7, 26, 43, 0.4), 0 0 30px rgba(34, 211, 238, 0.15)',
      marginTop: '2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '20%',
        width: '60%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, rgba(7, 26, 43, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22D3EE', display: 'inline-block', boxShadow: '0 0 8px #22D3EE' }} />
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>Live Express JWT Authentication Flow Visualizer</h3>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Automated execution trace from client login to protected API response</p>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="btn btn-outline-cyan"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
        >
          {isPlaying ? (
            <>
              <RefreshCw style={{ width: '14px', height: '14px', animation: 'spin 4s linear infinite' }} />
              <span>Auto Pipeline Active</span>
            </>
          ) : (
            <>
              <Play style={{ width: '14px', height: '14px' }} />
              <span>Resume Animation</span>
            </>
          )}
        </button>
      </div>

      {/* Workflow Diagram Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;

          return (
            <div
              key={step.id}
              onClick={() => {
                setActiveStep(idx);
                setIsPlaying(false);
              }}
              style={{
                background: isActive 
                  ? 'rgba(37, 99, 235, 0.2)' 
                  : isPassed 
                  ? 'rgba(34, 211, 238, 0.08)' 
                  : 'rgba(15, 34, 56, 0.6)',
                border: isActive 
                  ? '2px solid #22D3EE' 
                  : isPassed 
                  ? '1px solid rgba(34, 211, 238, 0.4)' 
                  : '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '0.85rem',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 0 25px rgba(34, 211, 238, 0.35)' : 'none',
                transform: isActive ? 'scale(1.04)' : 'scale(1)'
              }}
            >
              {/* Step indicator badge */}
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                fontSize: '0.65rem',
                fontWeight: '700',
                color: isActive ? '#22D3EE' : '#64748B'
              }}>
                0{step.id}
              </div>

              {/* Step Icon */}
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: isActive ? 'linear-gradient(135deg, #2563EB, #22D3EE)' : 'rgba(7, 26, 43, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
                border: isActive ? 'none' : `1px solid ${step.color}40`,
                boxShadow: isActive ? `0 0 16px ${step.color}` : 'none'
              }}>
                <Icon style={{ width: '22px', height: '22px', color: isActive ? '#ffffff' : step.color }} />
              </div>

              <h4 style={{ color: isActive ? '#ffffff' : '#CBD5E1', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.2rem' }}>
                {step.title}
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '0.72rem', marginBottom: '0.75rem' }}>
                {step.subtitle}
              </p>

              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '0.4rem',
                padding: '0.3rem 0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: isActive ? '#22D3EE' : '#64748B',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {step.code}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Step Details Bar */}
      <div style={{
        marginTop: '1.75rem',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '0.65rem',
        padding: '0.85rem 1.25rem',
        borderLeft: '4px solid #22D3EE',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#22D3EE', fontWeight: '700', fontSize: '0.85rem' }}>
            STAGE {steps[activeStep].id}: {steps[activeStep].title}
          </span>
          <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            — {steps[activeStep].code}
          </span>
        </div>
        <div style={{ color: '#22C55E', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 style={{ width: '14px', height: '14px' }} />
          <span>Verified HTTP Pipeline</span>
        </div>
      </div>
    </div>
  );
};
