import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, Lock, Cloud, Database, Download, ShieldCheck, FileCheck } from 'lucide-react';

export default function HowItWorksModal({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { title: '1. USER AUTHENTICATION', desc: 'Secure user login & register with Supabase Auth session isolation.', icon: Lock, color: '#2563EB' },
    { title: '2. SELECT FILE', desc: 'Drag-and-drop or select files from your computer.', icon: FileCheck, color: '#22D3EE' },
    { title: '3. FILE VALIDATION', desc: 'Client & backend size limit (50MB) and forbidden executable checks.', icon: ShieldCheck, color: '#FF7A18' },
    { title: '4. UPLOAD TO STORAGE', desc: 'Real binary upload to Supabase Storage / Node API storage engine.', icon: Cloud, color: '#22C55E' },
    { title: '5. SAVE DATABASE METADATA', desc: 'Store file details, ownership, mime-type, and size in PostgreSQL.', icon: Database, color: '#3B82F6' },
    { title: '6. SECURE ACCESS CONTROL', desc: 'Row Level Security (RLS) & signed URLs protect user file access.', icon: Lock, color: '#A855F7' },
    { title: '7. DOWNLOAD ACTUAL FILE', desc: 'Stream real binary payload & update download statistics.', icon: Download, color: '#FF7A18' },
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleStartAnimation = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>
              How ShareVault Works
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(7, 26, 43, 0.6)' }}>
              Interactive step-by-step real cloud architecture workflow
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Play Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button className="btn btn-orange" onClick={handleStartAnimation} disabled={isPlaying}>
            <Play size={16} fill="white" /> {isPlaying ? 'Simulating Workflow...' : 'Play Workflow Animation'}
          </button>
        </div>

        {/* Workflow Timeline Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            const isPassed = activeStep > idx;

            return (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--midnight-navy)' : isPassed ? 'rgba(34, 197, 94, 0.08)' : 'var(--soft-white)',
                  color: isActive ? 'var(--white)' : 'var(--midnight-navy)',
                  border: isActive ? `2px solid ${step.color}` : '1px solid rgba(7, 26, 43, 0.08)',
                  boxShadow: isActive ? `0 0 20px ${step.color}40` : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isActive ? step.color : isPassed ? 'var(--emerald)' : 'rgba(7, 26, 43, 0.1)',
                  color: isActive || isPassed ? 'var(--white)' : 'var(--midnight-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {isPassed ? <CheckCircle2 size={20} /> : <Icon size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isActive ? 'var(--cyber-cyan)' : 'inherit' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: isActive ? 0.9 : 0.7 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close Walkthrough</button>
        </div>
      </div>
    </div>
  );
}
