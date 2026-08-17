import React, { useState } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { PerformanceChart } from '../components/PerformanceChart';
import { CodeVisualizerModal } from '../components/CodeVisualizerModal';
import { Activity, Zap, Play, CheckCircle2, AlertTriangle, Cpu, RefreshCcw, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function PerformanceLab() {
  const {
    isOptimized,
    setIsOptimized,
    globalRenderCount,
    filterDurationMs,
    searchOps,
    filterOps,
    items,
    setSearchTerm
  } = usePerformance();

  const [isRunningStressTest, setIsRunningStressTest] = useState(false);
  const [stressProgress, setStressProgress] = useState(0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const runStressTest = () => {
    setIsRunningStressTest(true);
    setStressProgress(0);

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setStressProgress(count * 5);
      setSearchTerm(`test-${count % 10}`);

      if (count >= 20) {
        clearInterval(interval);
        setSearchTerm('');
        setIsRunningStressTest(false);
        if (isOptimized) {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
      }
    }, 40);
  };

  return (
    <div className="page-wrapper">
      
      {/* Banner */}
      <div className="glass-card" style={{ marginBottom: '1.75rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="pulse-emerald" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald)' }}>LIVE BENCHMARK SUITE</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>React Performance Laboratory</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Compare actual CPU render metrics between memoized vs un-memoized execution across {items.length} items.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={runStressTest}
              disabled={isRunningStressTest}
              style={{
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                background: isRunningStressTest ? 'var(--bg-surface)' : 'linear-gradient(135deg, var(--emerald) 0%, #059669 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: isRunningStressTest ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: isRunningStressTest ? 'none' : 'var(--shadow-glow-emerald)'
              }}
            >
              <Play size={16} /> {isRunningStressTest ? `Testing (${stressProgress}%)...` : 'Run 20-Query Stress Test'}
            </button>

            <button
              onClick={() => setIsCodeModalOpen(true)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: 'var(--cyan)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Code2 size={16} /> View Code Differences
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {isRunningStressTest && (
          <div style={{ marginTop: '1.25rem', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-full)', height: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${stressProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--cyan) 0%, var(--emerald) 100%)', transition: 'width 0.1s linear' }} />
          </div>
        )}
      </div>

      {/* Head to Head Comparison Table */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} style={{ color: 'var(--primary)' }} /> Mode Benchmark Comparison
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Metric / Technique</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--emerald)' }}>⚡ Optimized Mode</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--rose)' }}>🐢 Unoptimized Mode</th>
                <th style={{ padding: '0.85rem 1rem' }}>Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Filter & Sort Execution Latency</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald)', fontWeight: 700 }}>
                  ~1.5ms - 3ms
                </td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--rose)', fontWeight: 700 }}>
                  ~15ms - 45ms+
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                  10x - 15x Faster Response Time
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Array Search Memoization</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--emerald)' }}>
                  <CheckCircle2 size={16} inline /> Cached via <code style={{ color: 'var(--sky)' }}>useMemo</code>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--rose)' }}>
                  <AlertTriangle size={16} inline /> Re-calculated every render
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                  Eliminates wasteful CPU iteration
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Callback Reference Equality</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--emerald)' }}>
                  <CheckCircle2 size={16} inline /> Stable via <code style={{ color: 'var(--sky)' }}>useCallback</code>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--rose)' }}>
                  <AlertTriangle size={16} inline /> New inline function reference
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                  Prevents 1,000+ child card re-renders
                </td>
              </tr>

              <tr>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Child Card Component Memoization</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--emerald)' }}>
                  <CheckCircle2 size={16} inline /> Memoized with <code style={{ color: 'var(--sky)' }}>React.memo</code>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--rose)' }}>
                  <AlertTriangle size={16} inline /> Standard un-memoized render
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                  99.9% Renders Skipped on item toggle
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <PerformanceChart />

      <CodeVisualizerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
