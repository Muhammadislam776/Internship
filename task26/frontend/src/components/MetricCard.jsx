import React from 'react';

const MetricCard = ({ title, value, change, isPositive, icon, color = 'primary', description }) => {
  const colorMap = {
    primary: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
    danger: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
    cyan: { bg: 'rgba(6, 182, 212, 0.15)', text: '#06B6D4', border: 'rgba(6, 182, 212, 0.3)' },
    purple: { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', border: 'rgba(139, 92, 246, 0.3)' }
  };

  const currentTheme = colorMap[color] || colorMap.primary;

  return (
    <div className="card card-dark card-dark-hover h-100 p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-secondary small fw-medium text-uppercase tracking-wider">{title}</span>
        <div
          className="d-flex align-items-center justify-content-center rounded-3 p-2"
          style={{
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`,
            width: '40px',
            height: '40px'
          }}
        >
          <i className={`bi ${icon} fs-5`}></i>
        </div>
      </div>

      <div className="d-flex align-items-baseline justify-content-between mt-1">
        <h2 className="mb-0 fw-bold text-white font-mono">{value}</h2>
        {change && (
          <span className={`badge rounded-pill ${isPositive ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} px-2 py-1 small font-mono`}>
            <i className={`bi ${isPositive ? 'bi-arrow-up-short' : 'bi-arrow-down-short'}`}></i>
            {change}
          </span>
        )}
      </div>

      {description && (
        <div className="mt-2 text-secondary small" style={{ fontSize: '0.75rem' }}>
          {description}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
