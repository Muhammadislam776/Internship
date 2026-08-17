import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search files by name or type..." }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
      <Search 
        size={18} 
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(7, 26, 43, 0.4)'
        }} 
      />
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 2.6rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(7, 26, 43, 0.12)',
          background: 'var(--white)',
          outline: 'none',
          fontSize: '0.9rem',
          color: 'var(--midnight-navy)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'var(--transition)'
        }}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(7, 26, 43, 0.4)'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
