import React, { useEffect, useRef } from 'react';
import { useGallery } from '../context/GalleryContext';
import { Search, X } from 'lucide-react';

export const SearchBar: React.FC<{ placeholder?: string; className?: string }> = ({
  placeholder = 'Search photographs, locations, or stories... (Press "/" to focus)',
  className = '',
}) => {
  const { searchQuery, setSearchQuery } = useGallery();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-4 w-4 h-4 text-[#74746C] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 bg-white border border-[#DDD8CE] rounded-full text-sm text-[#242522] placeholder:text-[#74746C] focus:outline-none focus:border-[#C76546] focus:ring-2 focus:ring-[#F4E0D7] transition shadow-2xs"
        aria-label="Search photographs"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            inputRef.current?.focus();
          }}
          className="absolute right-3.5 p-1 text-[#74746C] hover:text-[#242522] rounded-full transition"
          aria-label="Clear search"
          title="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
