import React, { useState } from 'react';
import { X, Code2, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

export function CodeVisualizerModal({ isOpen, onClose }) {
  const [activeSnippet, setActiveSnippet] = useState('useMemo');

  if (!isOpen) return null;

  const snippets = {
    useMemo: {
      title: '1,200+ Item Filtering & Sorting',
      optimized: `// ⚡ OPTIMIZED: useMemo caches the 1,200+ item pipeline
const filteredItems = useMemo(() => {
  return filterAndSortItems(items, {
    searchTerm,
    selectedCategory,
    minRating,
    sortBy
  });
}, [items, searchTerm, selectedCategory, minRating, sortBy]);`,
      unoptimized: `// 🐢 UNOPTIMIZED: Re-calculates 1,200+ items on EVERY single render
const filteredItems = filterAndSortItems(items, {
  searchTerm,
  selectedCategory,
  minRating,
  sortBy
}); // Runs even when typing in unrelated inputs!`
    },
    useCallback: {
      title: 'Item Favorite Callback Reference',
      optimized: `// ⚡ OPTIMIZED: useCallback maintains function reference equality
const handleToggleFavorite = useCallback((id) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
  ));
}, []); // Identical reference across renders!`,
      unoptimized: `// 🐢 UNOPTIMIZED: Inline function creation on every render
const handleToggleFavorite = (id) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
  ));
}; // Forces ALL 1,200 child cards to re-render!`
    },
    reactMemo: {
      title: 'Item Card Component Memoization',
      optimized: `// ⚡ OPTIMIZED: React.memo skips renders when props are unchanged
export const ItemCard = React.memo(({ item, onToggleFavorite }) => {
  return <div className="card">{item.name}</div>;
}); // 1,199 cards skip render when 1 item is favorited!`,
      unoptimized: `// 🐢 UNOPTIMIZED: Standard component re-renders on parent state change
export const ItemCard = ({ item, onToggleFavorite }) => {
  return <div className="card">{item.name}</div>;
}; // All 1,200 cards re-render every time!`
    }
  };

  const curr = snippets[activeSnippet];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content slide-in" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code2 size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>React Optimization Code Inspector</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Snippet selector tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          {['useMemo', 'useCallback', 'reactMemo'].map(key => (
            <button
              key={key}
              onClick={() => setActiveSnippet(key)}
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeSnippet === key ? 'var(--primary)' : 'transparent',
                color: activeSnippet === key ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {key === 'reactMemo' ? 'React.memo' : key}
            </button>
          ))}
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--sky)' }}>
          {curr.title}
        </h4>

        {/* Code comparison grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
          
          {/* OPTIMIZED PANEL */}
          <div className="glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={16} /> ⚡ Optimized Pattern
            </div>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: '#34D399',
              whiteSpace: 'pre-wrap'
            }}>
              {curr.optimized}
            </pre>
          </div>

          {/* UNOPTIMIZED PANEL */}
          <div className="glass-card" style={{ borderColor: 'rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rose)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={16} /> 🐢 Unoptimized Pattern
            </div>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: '#FB7185',
              whiteSpace: 'pre-wrap'
            }}>
              {curr.unoptimized}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
