import React from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { useGallery } from '../context/GalleryContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showReset?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Photographs Found',
  description = 'We couldn\'t find any photographs matching your current search or category filter. Try clearing your search or switching categories.',
  showReset = true,
}) => {
  const { setSearchQuery, setActiveCategory } = useGallery();

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full py-16 px-6 rounded-3xl bg-white border border-dashed border-[#DDD8CE] flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8 shadow-xs"
    >
      <div className="w-14 h-14 rounded-full bg-[#F4E0D7] text-[#C76546] flex items-center justify-center mb-4">
        <Camera className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-[#242522] mb-2">{title}</h3>
      <p className="text-sm text-[#74746C] leading-relaxed max-w-md mb-6">{description}</p>
      {showReset && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C76546] text-white text-sm font-semibold hover:bg-[#A94E34] transition shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
