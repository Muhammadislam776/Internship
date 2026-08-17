import React from 'react';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export default function FilterBar({ 
  selectedCategory, 
  onSelectCategory, 
  viewMode, 
  onToggleViewMode, 
  sortBy, 
  onSortChange 
}) {
  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'document', label: 'Documents' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Videos' },
    { id: 'archive', label: 'Archives' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    }}>
      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: selectedCategory === cat.id ? 'none' : '1px solid rgba(7, 26, 43, 0.12)',
              background: selectedCategory === cat.id ? 'var(--electric-blue)' : 'var(--white)',
              color: selectedCategory === cat.id ? 'var(--white)' : 'var(--midnight-navy)',
              boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Right Controls: Sort + View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', background: 'var(--white)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(7, 26, 43, 0.12)' }}>
          <SlidersHorizontal size={14} color="rgba(7, 26, 43, 0.5)" />
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 600, color: 'var(--midnight-navy)', cursor: 'pointer' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">File Name (A-Z)</option>
            <option value="largest">Size (Largest)</option>
            <option value="smallest">Size (Smallest)</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: 'var(--white)', border: '1px solid rgba(7, 26, 43, 0.12)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
          <button 
            className="btn-icon"
            onClick={() => onToggleViewMode('grid')}
            style={{ 
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              background: viewMode === 'grid' ? 'rgba(37, 99, 235, 0.15)' : 'none',
              color: viewMode === 'grid' ? 'var(--electric-blue)' : 'rgba(7, 26, 43, 0.5)'
            }}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            className="btn-icon"
            onClick={() => onToggleViewMode('list')}
            style={{ 
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              background: viewMode === 'list' ? 'rgba(37, 99, 235, 0.15)' : 'none',
              color: viewMode === 'list' ? 'var(--electric-blue)' : 'rgba(7, 26, 43, 0.5)'
            }}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
