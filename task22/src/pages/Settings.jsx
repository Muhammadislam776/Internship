import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { useToast } from '../context/ToastContext';
import { Settings as SettingsIcon, Sliders, Database, Cpu, RefreshCw, Sparkles, Check } from 'lucide-react';

export function Settings() {
  const {
    itemCount,
    updateItemCount,
    isOptimized,
    setIsOptimized,
    simulatedCpuLoad,
    setSimulatedCpuLoad,
    animationsEnabled,
    setAnimationsEnabled,
    resetDataset
  } = usePerformance();

  const { addToast } = useToast();

  const handleScaleChange = (count) => {
    updateItemCount(count);
    addToast(`Dataset updated to ${count.toLocaleString()} items`, 'info');
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '900px' }}>
      
      <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <SettingsIcon size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Laboratory Settings</h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Configure dataset scale, artificial CPU overhead, and rendering preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Scale Section */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--sky)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Dataset Size Scale</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Select the number of active deterministic items generated in memory.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[500, 1250, 2500].map(count => (
              <button
                key={count}
                onClick={() => handleScaleChange(count)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: itemCount === count ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: itemCount === count ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,0,0,0.3)',
                  color: itemCount === count ? 'white' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>{count.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.2rem' }}>
                  {count === 500 ? 'Lightweight' : count === 1250 ? 'Standard Lab' : 'Extreme Benchmark'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CPU Overhead Simulator */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Cpu size={18} style={{ color: 'var(--amber)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Artificial CPU Workload Simulation</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Simulates heavy array cloning & iteration on un-memoized renders so performance lag is clearly visible even on fast multi-core M-series / i9 CPUs.
              </p>
            </div>

            <button
              onClick={() => {
                setSimulatedCpuLoad(prev => !prev);
                addToast(simulatedCpuLoad ? 'Artificial CPU load disabled' : 'Artificial CPU load enabled', 'info');
              }}
              style={{
                width: '50px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: simulatedCpuLoad ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: simulatedCpuLoad ? '25px' : '3px',
                transition: 'all 0.2s ease'
              }} />
            </button>
          </div>
        </div>

        {/* Reset Actions */}
        <div className="glass-card" style={{ borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--rose)' }}>Reset Laboratory State</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Resets dataset favorites, search filters, and performance counters to default state.
              </p>
            </div>

            <button
              onClick={() => {
                resetDataset();
                addToast('Laboratory state reset to default', 'success');
              }}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: 'var(--rose)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <RefreshCcw size={15} /> Reset Everything
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
