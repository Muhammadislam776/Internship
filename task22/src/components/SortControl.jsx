import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { SORT_OPTIONS } from '../data/items';
import { ArrowUpDown, Grid, List } from 'lucide-react';

export function SortControl() {
  const { sortBy, setSortBy, viewMode, setViewMode } = usePerformance();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <ArrowUpDown size={15} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-dim)', pointerEvents: 'none' }} />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '0.55rem 0.85rem 0.55rem 2.2rem',
            background: 'rgba(14, 20, 36, 0.8)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid vs List toggle */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setViewMode('grid')}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
            color: viewMode === 'grid' ? 'white' : 'var(--text-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Grid View"
        >
          <Grid size={16} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
            color: viewMode === 'list' ? 'white' : 'var(--text-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title="List View"
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
}
