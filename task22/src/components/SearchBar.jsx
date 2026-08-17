import React, { useRef, useEffect } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { Search, X } from 'lucide-react';

export function SearchBar() {
  const { searchTerm, setSearchTerm } = usePerformance();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-container">
      <Search size={18} className="search-icon" />
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search 1,000+ items by name, category, description or tags..."
        className="search-input"
      />
      {searchTerm ? (
        <button
          onClick={() => setSearchTerm('')}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: 0
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      ) : (
        <kbd className="search-kbd">/</kbd>
      )}
    </div>
  );
}
