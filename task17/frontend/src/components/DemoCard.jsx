import React from 'react';
import { Play, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function DemoCard({ onOpenModal }) {
  return (
    <div 
      className="glass-card-dark"
      style={{
        padding: '32px',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #07111F 0%, #0B1F33 100%)',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        borderRadius: '24px'
      }}
      onClick={onOpenModal}
    >
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Play Button */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--grad-indigo-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 0 25px rgba(34, 211, 238, 0.5)',
          flexShrink: 0,
          transition: 'transform 0.3s ease'
        }}>
          <Play size={28} fill="#FFFFFF" style={{ marginLeft: '4px' }} />
        </div>

        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2px 10px',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#22D3EE',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            <ShieldCheck size={12} /> INTERACTIVE ARCHITECTURE DEMO
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
            How Zod Middleware Protects Express.js
          </h3>
          
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '4px' }}>
            Click to launch step-by-step visual demonstration of the Request → Middleware → Zod → Controller pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
