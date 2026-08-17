import React, { useState } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { ItemCard, UnmemoizedItemCard } from '../components/ItemCard';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { Heart, Search, Compass } from 'lucide-react';

export function Favorites() {
  const { items, isOptimized, toggleFavorite, setSelectedItemForModal, setActiveTab } = usePerformance();
  const [favSearch, setFavSearch] = useState('');

  const favItems = items.filter(i => i.isFavorite);
  const filteredFavs = favSearch.trim() === ''
    ? favItems
    : favItems.filter(i =>
        i.name.toLowerCase().includes(favSearch.toLowerCase()) ||
        i.category.toLowerCase().includes(favSearch.toLowerCase())
      );

  const CardComponent = isOptimized ? ItemCard : UnmemoizedItemCard;

  return (
    <div className="page-wrapper">
      
      <div className="glass-card" style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={22} className="text-rose-400" fill="currentColor" /> Bookmarked Favorites ({favItems.length})
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Quick access to your saved items. Click heart icon to remove.
          </p>
        </div>

        {/* Filter within favorites search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={favSearch}
            onChange={(e) => setFavSearch(e.target.value)}
            className="search-input"
            style={{ padding: '0.55rem 0.85rem 0.55rem 2.4rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {favItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '5rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(244, 63, 94, 0.15)',
            color: 'var(--rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Heart size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Favorite Items Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.75rem', maxWidth: '450px', margin: '0 auto 1.75rem' }}>
            Explore the dataset of 1,000+ items and click the heart button on any item card to bookmark it here!
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            style={{
              padding: '0.75rem 1.6rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--violet) 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-glow-indigo)'
            }}
          >
            <Compass size={16} /> Explore Dataset
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {filteredFavs.map(item => (
            <CardComponent
              key={item.id}
              item={item}
              onToggleFavorite={toggleFavorite}
              onSelectDetail={setSelectedItemForModal}
            />
          ))}
        </div>
      )}

      <ItemDetailModal />
    </div>
  );
}
