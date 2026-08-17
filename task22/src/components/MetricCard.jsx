import React from 'react';

export function MetricCard({ title, value, subtext, icon: Icon, accentColor = 'indigo', badge }) {
  const colorMap = {
    indigo: { glow: 'var(--shadow-glow-indigo)', text: 'var(--primary)', border: 'rgba(99, 102, 241, 0.3)' },
    cyan: { glow: 'var(--shadow-glow-cyan)', text: 'var(--cyan)', border: 'rgba(6, 182, 212, 0.3)' },
    emerald: { glow: 'var(--shadow-glow-emerald)', text: 'var(--emerald)', border: 'rgba(16, 185, 129, 0.3)' },
    rose: { glow: '0 0 20px rgba(244, 63, 94, 0.25)', text: 'var(--rose)', border: 'rgba(244, 63, 94, 0.3)' },
  };

  const theme = colorMap[accentColor] || colorMap.indigo;

  return (
    <div
      className="metric-card"
      style={{
        borderColor: theme.border,
      }}
    >
      <div className="metric-header">
        <span>{title}</span>
        {Icon && <Icon size={18} style={{ color: theme.text }} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span className="metric-value" style={{ color: theme.text }}>
          {value}
        </span>
        {badge && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            background: theme.text + '22',
            color: theme.text
          }}>
            {badge}
          </span>
        )}
      </div>

      {subtext && <p className="metric-sub">{subtext}</p>}
    </div>
  );
}
