import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { useToast } from '../context/ToastContext';
import { Zap, Cpu, RefreshCw, Sparkles } from 'lucide-react';

export function Header() {
  const { activeTab, isOptimized, setIsOptimized, globalRenderCount, filterDurationMs, resetDataset } = usePerformance();
  const { addToast } = useToast();

  const titleMap = {
    dashboard: 'Performance Dashboard',
    explore: 'Interactive Dataset Explorer (1,000+ Items)',
    favorites: 'Bookmarked Items Gallery',
    lab: 'Head-to-Head Performance Lab',
    analytics: 'Render & Data Telemetry',
    settings: 'Laboratory Settings & Controls'
  };

  const handleModeToggle = (optimized) => {
    setIsOptimized(optimized);
    addToast(
      optimized
        ? '⚡ Switched to Optimized Mode (useMemo + useCallback active)'
        : '🐢 Switched to Unoptimized Mode (Full re-render profiling)',
      optimized ? 'success' : 'error'
    );
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{titleMap[activeTab] || 'HyperList'}</h2>
      </div>

      <div className="header-right">
        {/* Render counter live pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Cpu size={15} style={{ color: 'var(--sky)' }} />
          <span>Renders: <strong style={{ color: 'var(--text-main)' }}>{globalRenderCount}</strong></span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>Latency: <strong style={{ color: filterDurationMs < 5 ? 'var(--emerald)' : 'var(--amber)' }}>{filterDurationMs}ms</strong></span>
        </div>

        {/* Mode Switcher */}
        <div className="mode-pills">
          <button
            onClick={() => handleModeToggle(true)}
            className={`mode-pill-btn ${isOptimized ? 'active-optimized' : ''}`}
            title="Enable useMemo, useCallback, and React.memo"
          >
            <Zap size={14} /> Optimized
          </button>
          <button
            onClick={() => handleModeToggle(false)}
            className={`mode-pill-btn ${!isOptimized ? 'active-unoptimized' : ''}`}
            title="Enable un-memoized rendering for comparison"
          >
            🐢 Unoptimized
          </button>
        </div>

        {/* Reset Dataset button */}
        <button
          onClick={() => {
            resetDataset();
            addToast('Dataset reset to default state', 'info');
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Reset dataset & filters"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}
