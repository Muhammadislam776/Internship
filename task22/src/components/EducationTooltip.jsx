import React, { useState } from 'react';
import { HelpCircle, Code2, Check, Zap } from 'lucide-react';

export function EducationTooltip({ topic = 'useMemo' }) {
  const [isOpen, setIsOpen] = useState(false);

  const contentMap = {
    useMemo: {
      title: 'useMemo() Optimization',
      summary: 'Caches the result of an expensive calculation between re-renders.',
      why: 'In HyperList, filtering & sorting 1,200+ items takes heavy iteration. useMemo ensures search & filter calculations only run when input search terms or category filters change—preventing wasteful CPU work on unrelated UI renders!',
      code: `const filteredItems = useMemo(() => {
  return filterAndSortItems(items, filters);
}, [items, searchTerm, category]);`
    },
    useCallback: {
      title: 'useCallback() Optimization',
      summary: 'Caches a function definition between renders.',
      why: 'When passing callbacks (like handleToggleFavorite) to 1,000+ child cards, inline functions cause all child components to re-render because function references change on every render. useCallback maintains function reference equality!',
      code: `const toggleFavorite = useCallback((id) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
  ));
}, []);`
    },
    reactMemo: {
      title: 'React.memo() Component Caching',
      summary: 'Skips re-rendering a component if its props have not changed.',
      why: 'When a user favorites 1 item out of 1,200, React.memo allows 1,199 other item cards to skip re-rendering completely, maintaining smooth 60 FPS performance!',
      code: `export const ItemCard = React.memo(({ item, onToggle }) => {
  return <div className="card">{item.name}</div>;
});`
    }
  };

  const info = contentMap[topic] || contentMap.useMemo;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: 'var(--sky)',
          borderRadius: 'var(--radius-full)',
          padding: '0.2rem 0.6rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}
      >
        <HelpCircle size={13} /> Why {topic}?
      </button>

      {isOpen && (
        <div
          className="slide-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '320px',
            background: 'rgba(14, 20, 36, 0.98)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), var(--shadow-glow-indigo)',
            zIndex: 80
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={14} style={{ color: 'var(--primary)' }} /> {info.title}
            </h4>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            {info.summary}
          </p>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
            {info.why}
          </p>

          <pre style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.6rem',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--sky)',
            overflowX: 'auto'
          }}>
            {info.code}
          </pre>
        </div>
      )}
    </div>
  );
}
