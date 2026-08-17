import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { Activity, Clock } from 'lucide-react';

export function PerformanceChart() {
  const { renderHistory } = usePerformance();

  if (!renderHistory.length) {
    return (
      <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
        Awaiting telemetry data...
      </div>
    );
  }

  const maxLatency = Math.max(...renderHistory.map(h => h.durationMs), 10);
  const chartHeight = 180;
  const chartWidth = 600;

  // Generate SVG polyline path points
  const points = renderHistory.map((item, index) => {
    const x = (index / (renderHistory.length - 1 || 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (item.durationMs / maxLatency) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--cyan)' }} /> Real-Time Latency Telemetry (ms)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Execution time tracked live across user interactions & filter queries
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--emerald)' }} />
            <span>Optimized (&lt;2ms)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--rose)' }} />
            <span>Unoptimized (&gt;10ms)</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '180px', overflow: 'visible' }}>
          {/* Grid lines */}
          <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
          <line x1="20" y1="90" x2={chartWidth - 20} y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
          <line x1="20" y1="160" x2={chartWidth - 20} y2="160" stroke="rgba(255,255,255,0.1)" />

          {/* Polyline path */}
          {points && (
            <polyline
              fill="none"
              stroke="var(--cyan)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          )}

          {/* Data Points */}
          {renderHistory.map((item, index) => {
            const x = (index / (renderHistory.length - 1 || 1)) * (chartWidth - 40) + 20;
            const y = chartHeight - (item.durationMs / maxLatency) * (chartHeight - 30) - 15;
            const isOpt = item.isOptimized;

            return (
              <g key={item.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={isOpt ? 'var(--emerald)' : 'var(--rose)'}
                  stroke="var(--bg-dark)"
                  strokeWidth="2"
                />
                <title>{`${item.time}: ${item.durationMs}ms (${isOpt ? 'Optimized' : 'Unoptimized'})`}</title>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
        <span>Earlier Queries</span>
        <span>Latest Query: {renderHistory[renderHistory.length - 1]?.durationMs}ms</span>
      </div>
    </div>
  );
}
