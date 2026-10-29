import React from 'react';
import { GalleryImage } from '../types';
import { GalleryCard } from './GalleryCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

interface GalleryGridProps {
  images: GalleryImage[];
  isLoading: boolean;
  onOpenLightbox: (index: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  isLoading,
  onOpenLightbox,
  emptyTitle,
  emptyDescription,
}) => {
  if (isLoading) {
    return <LoadingState count={8} />;
  }

  if (images.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      role="region"
      aria-label="Photography collection"
    >
      {images.map((img, index) => (
        <GalleryCard
          key={img.id}
          image={img}
          index={index}
          onOpenLightbox={onOpenLightbox}
        />
      ))}
    </div>
  );
};
