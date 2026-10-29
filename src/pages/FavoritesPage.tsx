import React, { useState, useMemo } from 'react';
import { useGallery } from '../context/GalleryContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GalleryGrid } from '../components/GalleryGrid';
import { Heart, Search, ArrowRight, UserPlus } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { images, favorites, isLoading, openLightbox } = useGallery();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');

  // Filter images that are favorited
  const favoriteImages = useMemo(() => {
    let favList = images.filter((img) => favorites.has(img.id));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      favList = favList.filter(
        (img) =>
          img.title.toLowerCase().includes(q) ||
          img.category_name?.toLowerCase().includes(q) ||
          img.location.toLowerCase().includes(q)
      );
    }
    return favList;
  }, [images, favorites, search]);

  return (
    <div className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#DDD8CE] mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C76546] mb-1">
            <Heart className="w-3.5 h-3.5 fill-[#C76546]" />
            <span>Personal Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#242522]">
            My Saved Favorites
          </h1>
          <p className="text-sm sm:text-base text-[#74746C] mt-2">
            Revisit the photographs and stories that moved you.
          </p>
        </div>

        {/* Search within favorites */}
        {favorites.size > 0 && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your favorites..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDD8CE] rounded-full text-sm text-[#242522] placeholder:text-[#74746C] focus:outline-none focus:border-[#C76546] shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* Guest Notice Callout if not signed in */}
      {!isAuthenticated && favorites.size > 0 && (
        <div className="bg-[#E7EBDD] border border-[#687453]/20 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#687453] text-white flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#46523A]">
                You have {favorites.size} photograph{favorites.size === 1 ? '' : 's'} saved to this browser session.
              </p>
              <p className="text-xs text-[#687453]">
                Create a free account or sign in to synchronize your collection across all devices.
              </p>
            </div>
          </div>
          <Link
            to="/register"
            className="px-4 py-2 bg-[#687453] hover:bg-[#46523A] text-white text-xs font-bold rounded-full transition shadow-xs whitespace-nowrap"
          >
            Create Account
          </Link>
        </div>
      )}

      {/* Favorites Gallery Grid */}
      <GalleryGrid
        images={favoriteImages}
        isLoading={isLoading}
        onOpenLightbox={(index) => openLightbox(index)}
        emptyTitle={
          search ? `No favorites matching "${search}"` : 'Your Favorites Collection is Empty'
        }
        emptyDescription={
          search
            ? 'Try searching with different keywords or clear the search input.'
            : 'You haven\'t marked any photographs as favorites yet. Browse the public gallery and tap the heart icon on any work that inspires you.'
        }
      />

      {favorites.size === 0 && !isLoading && (
        <div className="text-center mt-6">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-sm font-semibold transition shadow-xs"
          >
            <span>Explore the Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
