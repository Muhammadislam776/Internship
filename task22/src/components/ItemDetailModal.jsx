import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { X, Star, Heart, Calendar, ShieldCheck, Eye, Download, Cpu, Tag } from 'lucide-react';

export function ItemDetailModal() {
  const { selectedItemForModal, setSelectedItemForModal, toggleFavorite } = usePerformance();

  if (!selectedItemForModal) return null;

  const item = selectedItemForModal;

  return (
    <div className="modal-overlay" onClick={() => setSelectedItemForModal(null)}>
      <div className="modal-content slide-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span className={`card-status-badge badge-${item.status}`}>
            {item.status}
          </span>
          <button
            onClick={() => setSelectedItemForModal(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Hero section */}
        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '1px solid var(--border-color)'
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {item.name}
            </h3>
            <p style={{ color: 'var(--sky)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {item.category}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#FBBF24' }}>
                <Star size={16} fill="currentColor" />
                <span style={{ fontWeight: 700 }}>{item.rating}</span>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                ${item.price}
              </span>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {item.description}
        </p>

        {/* Detailed Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="metric-card" style={{ padding: '0.85rem' }}>
            <div className="metric-header"><Eye size={14} /> Total Views</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.metrics.views.toLocaleString()}</div>
          </div>
          <div className="metric-card" style={{ padding: '0.85rem' }}>
            <div className="metric-header"><Download size={14} /> Downloads</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.metrics.downloads.toLocaleString()}</div>
          </div>
          <div className="metric-card" style={{ padding: '0.85rem' }}>
            <div className="metric-header"><Cpu size={14} /> Render Latency</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>{item.metrics.renderCostMs}ms</div>
          </div>
          <div className="metric-card" style={{ padding: '0.85rem' }}>
            <div className="metric-header"><ShieldCheck size={14} /> Memo Saved</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--violet)' }}>{item.metrics.memoSavedCount} cycles</div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>TAGS</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {item.tags.map(tag => (
              <span key={tag} className="card-tag" style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => toggleFavorite(item.id)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: item.isFavorite ? '1px solid var(--rose)' : '1px solid var(--border-color)',
              background: item.isFavorite ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: item.isFavorite ? 'var(--rose)' : 'var(--text-main)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Heart size={18} fill={item.isFavorite ? 'currentColor' : 'none'} />
            {item.isFavorite ? 'Favorited' : 'Add to Favorites'}
          </button>
        </div>

      </div>
    </div>
  );
}
