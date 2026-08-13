import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function FlipCard({ frontTitle, frontValue, backTitle, backValue, type = 'success' }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const isSuccess = type === 'success';

  return (
    <div 
      className="flip-card-container"
      onClick={() => setIsFlipped(!isFlipped)}
      title="Click or hover to flip card"
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Face */}
        <div className="flip-card-front">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {frontTitle}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isSuccess ? '#22C55E' : '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isSuccess ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{frontValue}</div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#6366F1', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
            <RefreshCw size={12} /> Hover or click for 3D stats
          </div>
        </div>

        {/* Back Face */}
        <div className="flip-card-back" style={{
          borderColor: isSuccess ? '#22C55E' : '#EF4444'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase' }}>
              {backTitle}
            </span>
            <Sparkles size={16} color="#FF7A18" />
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isSuccess ? '#22C55E' : '#FB7185' }}>
            {backValue}
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
            Interactive Zod Middleware Metric
          </div>
        </div>
      </div>
    </div>
  );
}
