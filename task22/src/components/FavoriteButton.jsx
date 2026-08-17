import React, { useRef } from 'react';
import { Heart } from 'lucide-react';
import { usePerformance } from '../context/PerformanceContext';

function FavoriteButtonComponent({ itemId, isFavorite, onToggle }) {
  const { isOptimized } = usePerformance();
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const handleClick = (e) => {
    e.stopPropagation(); // prevent card flip when clicking heart
    onToggle(itemId);
  };

  return (
    <button
      onClick={handleClick}
      className={`fav-btn ${isFavorite ? 'is-fav' : ''}`}
      title={`${isFavorite ? 'Remove from' : 'Add to'} favorites (Child renders: ${renderCountRef.current})`}
      aria-label="Toggle Favorite"
    >
      <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
}

// In Optimized Mode, wrap in React.memo! In Unoptimized Mode, pass unmemoized component!
export const FavoriteButton = React.memo(FavoriteButtonComponent);
export const UnmemoizedFavoriteButton = FavoriteButtonComponent;
