import React from 'react';
import { useGallery } from '../context/GalleryContext';
import { Heart } from 'lucide-react';

export const CategoryFilters: React.FC = () => {
  const { categories, images, favorites, activeCategory, setActiveCategory } = useGallery();

  // Calculate live count per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      All: images.length,
      favorites: favorites.size,
    };

    categories.forEach((cat) => {
      counts[cat.slug || cat.name] = images.filter(
        (img) =>
          img.category_id.toLowerCase() === cat.id.toLowerCase() ||
          img.category_id.toLowerCase() === (cat.slug || '').toLowerCase() ||
          img.category_name?.toLowerCase() === cat.name.toLowerCase()
      ).length;
    });

    return counts;
  }, [categories, images, favorites]);

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      role="tablist"
      aria-label="Category filters"
    >
      {/* All Photos */}
      <button
        type="button"
        role="tab"
        aria-selected={activeCategory === 'All'}
        onClick={() => setActiveCategory('All')}
        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] ${
          activeCategory === 'All'
            ? 'bg-[#C76546] text-white shadow-xs'
            : 'bg-white text-[#74746C] hover:text-[#242522] hover:bg-[#EDE9E1] border border-[#DDD8CE]'
        }`}
      >
        <span>All Photos</span>
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            activeCategory === 'All' ? 'bg-white/25 text-white' : 'bg-[#EDE9E1] text-[#74746C]'
          }`}
        >
          {categoryCounts['All'] || 0}
        </span>
      </button>

      {/* Dynamic Categories */}
      {categories.map((cat) => {
        const catKey = cat.slug || cat.name;
        const isActive = activeCategory.toLowerCase() === catKey.toLowerCase();
        const count = categoryCounts[catKey] || 0;

        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveCategory(catKey)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] ${
              isActive
                ? 'bg-[#C76546] text-white shadow-xs'
                : 'bg-white text-[#74746C] hover:text-[#242522] hover:bg-[#EDE9E1] border border-[#DDD8CE]'
            }`}
          >
            <span>{cat.name}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-white/25 text-white' : 'bg-[#EDE9E1] text-[#74746C]'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}

      {/* Saved Favorites Filter Tab */}
      <button
        type="button"
        role="tab"
        aria-selected={activeCategory === 'favorites'}
        onClick={() => setActiveCategory('favorites')}
        className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] ${
          activeCategory === 'favorites'
            ? 'bg-[#C76546] text-white shadow-xs'
            : 'bg-white text-[#74746C] hover:text-[#242522] hover:bg-[#EDE9E1] border border-[#DDD8CE]'
        }`}
      >
        <Heart
          className={`w-3.5 h-3.5 ${
            activeCategory === 'favorites' ? 'fill-white' : 'text-[#C76546] fill-[#C76546]'
          }`}
        />
        <span>Saved</span>
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            activeCategory === 'favorites' ? 'bg-white/25 text-white' : 'bg-[#EDE9E1] text-[#74746C]'
          }`}
        >
          {favorites.size}
        </span>
      </button>
    </div>
  );
};
