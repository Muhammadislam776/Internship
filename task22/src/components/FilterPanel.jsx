import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { CATEGORIES, STATUSES } from '../data/items';
import { Filter, Star, RefreshCcw } from 'lucide-react';

export function FilterPanel() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    minRating,
    setMinRating,
    maxPrice,
    setMaxPrice,
    categoryCounts,
    setSearchTerm,
    items
  } = usePerformance();

  const isFiltered = selectedCategory !== 'All' || selectedStatus !== 'All' || minRating > 0 || maxPrice < 1000;

  const handleClearAll = () => {
    setSelectedCategory('All');
    setSelectedStatus('All');
    setMinRating(0);
    setMaxPrice(1000);
    setSearchTerm('');
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Category Pills Header */}
      <div className="category-pills">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
        >
          All Items <span className="category-count">{categoryCounts.All || items.length}</span>
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat} <span className="category-count">{categoryCounts[cat] || 0}</span>
          </button>
        ))}
      </div>

      {/* Secondary Controls Bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                color: 'var(--text-main)',
                fontSize: '0.82rem'
              }}
            >
              <option value="All">All Statuses</option>
              {STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Rating filter buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>Min Rating:</span>
            {[0, 4.0, 4.5].map(r => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: minRating === r ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                  color: minRating === r ? 'white' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                {r === 0 ? 'Any' : <><Star size={11} fill="currentColor" /> {r}+</>}
              </button>
            ))}
          </div>

          {/* Max Price Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Max Price:</span>
            <input
              type="range"
              min="20"
              max="1000"
              step="20"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100px' }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--emerald)' }}>
              ${maxPrice}
            </span>
          </div>

        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={handleClearAll}
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--rose)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <RefreshCcw size={13} /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
