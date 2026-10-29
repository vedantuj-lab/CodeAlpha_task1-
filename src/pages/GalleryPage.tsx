import React from 'react';
import { useGallery } from '../context/GalleryContext';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilters } from '../components/CategoryFilters';
import { GalleryGrid } from '../components/GalleryGrid';
import { SortOption } from '../types';
import { SlidersHorizontal } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { 
    filteredImages, 
    images, 
    isLoading, 
    openLightbox, 
    sortBy, 
    setSortBy, 
    activeCategory, 
    searchQuery 
  } = useGallery();

  return (
    <div className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#DDD8CE] mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C76546]">
            The Public Anthology
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#242522] mt-1.5">
            Explore Photography
          </h1>
          <p className="text-sm sm:text-base text-[#74746C] mt-2">
            Find your next favorite perspective among our curated works.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 lg:w-96">
          <SearchBar placeholder="Search titles, tags, locations..." />
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD8CE] shadow-2xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <CategoryFilters />

        {/* Sort Controls & Match Count */}
        <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#DDD8CE]">
          <span className="text-xs font-semibold text-[#74746C] whitespace-nowrap">
            Showing <strong className="text-[#242522]">{filteredImages.length}</strong> of {images.length}
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#74746C]" />
            <label htmlFor="sort-select" className="sr-only">Sort photographs</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#242522] focus:outline-none focus:border-[#C76546] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Additions</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <GalleryGrid
        images={filteredImages}
        isLoading={isLoading}
        onOpenLightbox={(index) => openLightbox(index)}
        emptyTitle={
          activeCategory === 'favorites'
            ? 'Your Favorites Collection is Empty'
            : searchQuery
            ? `No matches for "${searchQuery}"`
            : 'No Photographs in this Category'
        }
        emptyDescription={
          activeCategory === 'favorites'
            ? 'You haven\'t saved any photographs to your favorites yet. Click the heart icon on any photo card to start building your personal gallery.'
            : 'Try adjusting your search keywords, exploring a different category, or resetting all filters.'
        }
      />
    </div>
  );
};
