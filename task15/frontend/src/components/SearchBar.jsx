import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';

export const SearchBar = ({ 
  search, 
  onSearchChange, 
  inputRef 
}) => {
  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef?.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputRef]);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-[#22D3EE] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users by Name, Email, User ID, or Phone..."
          className="w-full pl-12 pr-24 py-3.5 rounded-2xl glass-input text-sm text-white placeholder-[#9FB0C2]/70 shadow-lg border border-[#22D3EE]/25 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 transition-all"
        />
        {search ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 p-1.5 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-4 hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-[#9FB0C2] font-mono pointer-events-none">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </div>
    </div>
  );
};
