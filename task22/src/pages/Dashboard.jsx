import React, { useState } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { MetricCard } from '../components/MetricCard';
import { PerformanceChart } from '../components/PerformanceChart';
import { EducationTooltip } from '../components/EducationTooltip';
import { CodeVisualizerModal } from '../components/CodeVisualizerModal';
import { Zap, Compass, Activity, Database, Clock, Sparkles, Code2, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const {
    items,
    filteredItems,
    globalRenderCount,
    filterDurationMs,
    isOptimized,
    setIsOptimized,
    setActiveTab,
    datasetStats
  } = usePerformance();

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div className="page-wrapper">
      {/* Hero Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(6, 182, 212, 0.12) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          marginBottom: '2rem',
          padding: '2.5rem 2rem',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 800 }}>
              REACT PERFORMANCE LAB
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--sky)', fontWeight: 600 }}>
              1,000+ Items Telemetry Engine
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '0.85rem' }}>
            Explore 1,000+ Items. <br />
            Measure Every Render. Master React Performance.
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Experience real-time performance benchmarking between <strong>⚡ Optimized mode</strong> (using <code style={{ color: 'var(--sky)' }}>useMemo</code>, <code style={{ color: 'var(--sky)' }}>useCallback</code> & <code style={{ color: 'var(--sky)' }}>React.memo</code>) and <strong>🐢 Unoptimized mode</strong>.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('explore')}
              style={{
                padding: '0.85rem 1.6rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--violet) 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-glow-indigo)'
              }}
            >
              <Compass size={18} /> Explore Dataset <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              style={{
                padding: '0.85rem 1.6rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Activity size={18} /> Run Performance Lab
            </button>

            <button
              onClick={() => setIsCodeModalOpen(true)}
              style={{
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: 'var(--cyan)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Code2 size={18} /> Inspect Code
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Dataset"
          value={items.length.toLocaleString()}
          subtext="Deterministic SaaS objects"
          icon={Database}
          accentColor="indigo"
        />

        <MetricCard
          title="Global Renders"
          value={globalRenderCount}
          subtext="Component render passes"
          icon={Activity}
          accentColor="cyan"
        />

        <MetricCard
          title="Filter Latency"
          value={`${filterDurationMs}ms`}
          subtext="Search & sort execution"
          icon={Clock}
          accentColor={filterDurationMs < 5 ? 'emerald' : 'rose'}
          badge={filterDurationMs < 5 ? 'Fast' : 'Heavy'}
        />

        <MetricCard
          title="Optimization State"
          value={isOptimized ? '⚡ ENABLED' : '🐢 DISABLED'}
          subtext={isOptimized ? 'useMemo & useCallback active' : 'Full re-render profiling'}
          icon={Zap}
          accentColor={isOptimized ? 'emerald' : 'rose'}
        />
      </div>

      {/* Real-time Telemetry Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <PerformanceChart />
      </div>

      {/* Educational Optimization Highlights */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--violet)' }} /> React Optimization Cheat Sheet
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--primary)' }}>useMemo()</h4>
              <EducationTooltip topic="useMemo" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Caches expensive array filtering, sorting, and metric calculations across 1,200+ items.
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--cyan)' }}>useCallback()</h4>
              <EducationTooltip topic="useCallback" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Preserves function reference equality for card favorite toggles, avoiding child card re-renders.
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--emerald)' }}>React.memo()</h4>
              <EducationTooltip topic="reactMemo" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Wraps ItemCard and FavoriteButton so 1,199 cards skip re-rendering when 1 item state changes.
            </p>
          </div>

        </div>
      </div>

      <CodeVisualizerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
