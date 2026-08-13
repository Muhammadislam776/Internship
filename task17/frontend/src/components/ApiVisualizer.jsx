import React, { useState, useEffect } from 'react';
import { ArrowDown, CheckCircle, XCircle, ShieldCheck, Cpu, Database, Play, RefreshCw } from 'lucide-react';

export default function ApiVisualizer() {
  const [mode, setMode] = useState('valid'); // 'valid' | 'invalid'
  const [step, setStep] = useState(1);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setStep((prevStep) => (prevStep % 3) + 1);
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const validPayload = {
    name: "Alex Vance",
    email: "alex@example.com",
    password: "Password@123",
    confirmPassword: "Password@123",
    age: 24,
    phone: "+1-555-0192",
    country: "United States",
    role: "developer"
  };

  const invalidPayload = {
    name: "Alex",
    email: "alex-invalid-email",
    password: "weak",
    confirmPassword: "mismatch",
    age: 15,
    phone: "123",
    country: "",
    role: "super-admin"
  };

  const currentPayload = mode === 'valid' ? validPayload : invalidPayload;

  return (
    <div className="visualizer-card">
      <div className="viz-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="mac-dots">
            <span className="mac-dot mac-red"></span>
            <span className="mac-dot mac-yellow"></span>
            <span className="mac-dot mac-green"></span>
          </div>
          <span className="viz-title">ZOD MIDDLEWARE PIPELINE VISUALIZER</span>
        </div>

        {/* Toggle Mode Button */}
        <button
          onClick={() => {
            setMode(mode === 'valid' ? 'invalid' : 'valid');
            setStep(1);
          }}
          style={{
            background: mode === 'valid' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${mode === 'valid' ? '#22C55E' : '#EF4444'}`,
            color: mode === 'valid' ? '#22C55E' : '#EF4444',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={12} />
          <span>Simulate: {mode === 'valid' ? 'Valid Request' : 'Invalid Request'}</span>
        </button>
      </div>

      <div className="viz-pipeline">
        {/* Step 1: HTTP Request */}
        <div className={`viz-step ${step === 1 ? 'active' : ''}`}>
          <div className="viz-step-label" style={{ color: '#22D3EE' }}>
            <span>1. INCOMING REQUEST</span>
            <span className="font-mono">POST /api/users</span>
          </div>
          <pre style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.78rem',
            color: '#E2E8F0',
            overflowX: 'auto'
          }}>
            {JSON.stringify(currentPayload, null, 2)}
          </pre>
        </div>

        {/* Animated Down Arrow */}
        <div className="viz-arrow-connector">
          <ArrowDown size={20} />
        </div>

        {/* Step 2: ZOD VALIDATOR MIDDLEWARE */}
        <div className={`viz-step ${step === 2 ? 'active' : ''}`} style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(11, 31, 51, 0.9))',
          borderColor: '#6366F1'
        }}>
          <div className="viz-step-label" style={{ color: '#6366F1' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> ZOD MIDDLEWARE (validateUser)
            </span>
            <span style={{ fontSize: '0.72rem', background: '#6366F1', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
              safeParse()
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Inspects <code>req.body</code> against <code>userSchema</code> rules before reaching Express Controller.
          </div>
        </div>

        {/* Animated Down Arrow */}
        <div className="viz-arrow-connector">
          <ArrowDown size={20} />
        </div>

        {/* Step 3: Result Outcome */}
        <div className={`viz-step ${step === 3 ? 'active' : ''}`} style={{
          background: mode === 'valid' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          borderColor: mode === 'valid' ? '#22C55E' : '#EF4444'
        }}>
          <div className="viz-step-label">
            {mode === 'valid' ? (
              <span style={{ color: '#22C55E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={18} /> ✓ VALID REQUEST (HTTP 200)
              </span>
            ) : (
              <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={18} /> ✕ REJECTED BY ZOD (HTTP 400)
              </span>
            )}
            <span style={{ color: mode === 'valid' ? '#22C55E' : '#EF4444', fontSize: '0.75rem', fontWeight: 700 }}>
              {mode === 'valid' ? 'Controller Executed' : 'Short-Circuited'}
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#E2E8F0', marginTop: '6px' }}>
            {mode === 'valid' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22C55E' }}>
                <Database size={14} /> Sanitized data stored in database. <code>next()</code> called.
              </div>
            ) : (
              <div style={{ color: '#FB7185' }}>
                Reject Reason: Invalid email format, weak password, age &lt; 18. Returned structured 400 Bad Request JSON.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
