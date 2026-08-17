import React, { useState, useRef } from 'react';
import { Star, RotateCw, ExternalLink, Cpu, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { FavoriteButton, UnmemoizedFavoriteButton } from './FavoriteButton';
import { usePerformance } from '../context/PerformanceContext';

function ItemCardComponent({ item, onToggleFavorite, onSelectDetail }) {
  const { isOptimized } = usePerformance();
  const [isFlipped, setIsFlipped] = useState(false);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const FavBtn = isOptimized ? FavoriteButton : UnmemoizedFavoriteButton;

  const handleCardClick = (e) => {
    // If click is not on favorite button or external link, flip card
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="card-perspective">
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
        
        {/* FRONT OF CARD */}
        <div className="card-front">
          <div>
            <div className="card-media">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80';
                }}
              />
              <span className={`card-status-badge badge-${item.status}`}>
                {item.status}
              </span>
              <FavBtn
                itemId={item.id}
                isFavorite={item.isFavorite}
                onToggle={onToggleFavorite}
              />
            </div>

            <div className="card-title-row">
              <h3 className="card-title">{item.name}</h3>
              <span style={{ fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                ${item.price}
              </span>
            </div>

            <p className="card-category">{item.category}</p>
          </div>

          <div>
            <div className="card-meta-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#FBBF24' }}>
                <Star size={14} fill="currentColor" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.rating}</span>
              </div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                Renders: <strong style={{ color: isOptimized ? 'var(--emerald)' : 'var(--rose)' }}>{renderCountRef.current}</strong>
              </div>
            </div>

            <div className="card-tags">
              {item.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="card-tag">#{tag}</span>
              ))}
            </div>

            <div className="flip-hint">
              <RotateCw size={12} /> Click to flip details
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div className="card-back">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="card-category" style={{ margin: 0 }}>
                {item.category} Details
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                ID #{item.id}
              </span>
            </div>

            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              {item.name}
            </h4>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
              {item.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={13} style={{ color: 'var(--sky)' }} />
                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={13} style={{ color: 'var(--violet)' }} />
                <span>Render Cost: {item.metrics.renderCostMs}ms</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={13} style={{ color: 'var(--emerald)' }} />
                <span>Memo Saved: {item.metrics.memoSavedCount} cycles</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectDetail(item);
              }}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--violet) 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-glow-indigo)'
              }}
            >
              <ExternalLink size={14} /> Full Analytics
            </button>
            <div className="flip-hint" style={{ marginTop: '0.5rem' }}>
              <RotateCw size={12} /> Click to flip back
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// In Optimized Mode, wrap in React.memo!
export const ItemCard = React.memo(ItemCardComponent);
export const UnmemoizedItemCard = ItemCardComponent;
