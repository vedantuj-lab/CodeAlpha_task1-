import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useGallery } from '../context/GalleryContext';

interface FavoriteButtonProps {
  imageId: string;
  showCount?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  imageId,
  showCount = false,
  className = '',
  size = 'md',
}) => {
  const { favorites, favoriteCounts, toggleFavorite } = useGallery();
  const [animating, setAnimating] = useState(false);

  const isFav = favorites.has(imageId);
  const count = favoriteCounts[imageId] || 0;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimating(true);
    await toggleFavorite(imageId);
    setTimeout(() => setAnimating(false), 300);
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const btnPaddings = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group/fav relative flex items-center gap-1.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] ${
        isFav
          ? 'bg-white text-[#C76546] shadow-sm'
          : 'bg-white/90 backdrop-blur-xs text-[#74746C] hover:text-[#C76546] hover:bg-white shadow-xs'
      } ${btnPaddings[size]} ${className}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-200 ${
          isFav ? 'fill-[#C76546]' : 'fill-transparent'
        } ${animating ? 'scale-125' : 'group-hover/fav:scale-110'}`}
      />
      {showCount && (
        <span className="text-xs font-semibold pr-1">
          {count > 0 ? count : ''}
        </span>
      )}
    </button>
  );
};
