import React, { useState } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { SortControl } from '../components/SortControl';
import { ItemCard, UnmemoizedItemCard } from '../components/ItemCard';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { Compass, RefreshCcw, Layers, Zap } from 'lucide-react';

export function Explore() {
  const {
    filteredItems,
    isOptimized,
    viewMode,
    toggleFavorite,
    setSelectedItemForModal,
    filterDurationMs,
    searchTerm,
    setSearchTerm
  } = usePerformance();

  // Controlled pagination for maximum browser DOM rendering responsiveness
  const [displayLimit, setDisplayLimit] = useState(60);

  const displayedItems = filteredItems.slice(0, displayLimit);
  const hasMore = displayLimit < filteredItems.length;

  const CardComponent = isOptimized ? ItemCard : UnmemoizedItemCard;

  return (
    <div className="page-wrapper">
      
      {/* Control Header */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <SearchBar />
          <SortControl />
        </div>

        <FilterPanel />
      </div>

      {/* Dataset Summary Line */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>
            Showing {filteredItems.length.toLocaleString()} matching items
          </span>
          {displayLimit < filteredItems.length && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Rendered first {displayLimit}
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={14} style={{ color: isOptimized ? 'var(--emerald)' : 'var(--rose)' }} />
          <span>Execution: <strong style={{ color: isOptimized ? 'var(--emerald)' : 'var(--rose)' }}>{filterDurationMs}ms</strong></span>
        </div>
      </div>

      {/* Item List / Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
          <Compass size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Items Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No results match your search term "{searchTerm}" or active filters.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <RefreshCcw size={14} /> Clear Search Query
          </button>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' ? 'items-grid' : 'items-list'}>
            {displayedItems.map(item => (
              <CardComponent
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                onSelectDetail={setSelectedItemForModal}
              />
            ))}
          </div>

          {/* Load More Pagination Button */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setDisplayLimit(prev => prev + 60)}
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid var(--primary)',
                  color: 'var(--sky)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-glow-indigo)'
                }}
              >
                <Layers size={16} /> Load Next 60 Items ({filteredItems.length - displayLimit} remaining)
              </button>
            </div>
          )}
        </>
      )}

      <ItemDetailModal />
    </div>
  );
}
