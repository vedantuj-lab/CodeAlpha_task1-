import React, { useState } from 'react';
import { GalleryImage } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { MapPin, Maximize2, Sparkles, ImageOff } from 'lucide-react';

interface GalleryCardProps {
  image: GalleryImage;
  index: number;
  onOpenLightbox: (index: number) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ image, index, onOpenLightbox }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectClass =
    image.aspect_ratio === 'portrait'
      ? 'aspect-3/4'
      : image.aspect_ratio === 'square'
      ? 'aspect-square'
      : 'aspect-4/3';

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`View photograph: ${image.title} by ${image.photographer}`}
      onClick={() => onOpenLightbox(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenLightbox(index);
        }
      }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#DDD8CE] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] cursor-pointer"
    >
      {/* Media Box */}
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#EDE9E1]`}>
        {/* Skeleton Shimmer */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 skeleton-shimmer z-10" />
        )}

        {/* Failed image fallback */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#EDE9E1] text-[#74746C] z-10">
            <ImageOff className="w-8 h-8 text-[#687453] mb-2" />
            <p className="font-serif text-sm font-semibold text-[#242522]">{image.title}</p>
            <span className="text-xs text-[#74746C]">Offline Preview</span>
          </div>
        ) : (
          <img
            src={image.image_url}
            alt={`${image.title} - ${image.category_name || 'Fine art'} photography by ${image.photographer}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Featured Badge */}
        {image.is_featured && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E201E]/80 backdrop-blur-xs text-[#C7A56B] text-[11px] font-bold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}

        {/* Top-Right Favorite Button */}
        <div className="absolute top-3 right-3 z-20">
          <FavoriteButton imageId={image.id} size="md" />
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E201E]/85 via-[#1E201E]/30 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-20 pointer-events-none">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <MapPin className="w-3.5 h-3.5 text-[#C76546]" />
              <span>{image.location}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4.5 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-[#687453] mb-1.5">
          <span>{image.category_name}</span>
          <span className="text-[#74746C] font-normal normal-case">
            By {image.photographer}
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#242522] group-hover:text-[#C76546] transition-colors line-clamp-1 mb-1">
          {image.title}
        </h3>

        <p className="text-xs text-[#74746C] line-clamp-2 leading-relaxed">
          {image.description}
        </p>
      </div>
    </article>
  );
};
