import React from 'react';

export default function LoadingSkeleton({ type = 'card', count = 4 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {items.map((_, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'pulse 1.5s infinite ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(7,26,43,0.08)' }} />
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(7,26,43,0.08)' }} />
            </div>
            <div style={{ width: '70%', height: '16px', background: 'rgba(7,26,43,0.08)', borderRadius: '4px' }} />
            <div style={{ width: '40%', height: '12px', background: 'rgba(7,26,43,0.08)', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem', animation: 'pulse 1.5s infinite ease-in-out' }}>
      <div style={{ height: '30px', background: 'rgba(7,26,43,0.08)', borderRadius: '4px', marginBottom: '1rem' }} />
      <div style={{ height: '20px', background: 'rgba(7,26,43,0.08)', borderRadius: '4px', marginBottom: '0.6rem' }} />
      <div style={{ height: '20px', background: 'rgba(7,26,43,0.08)', borderRadius: '4px' }} />
    </div>
  );
}
