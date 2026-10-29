import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { Heart, Compass, Sparkles, UserCheck, ArrowRight, Layers } from 'lucide-react';
import { GalleryCard } from '../components/GalleryCard';

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const { images, favorites, categories, openLightbox } = useGallery();

  // Curate 4 recommended works (featured or popular)
  const recommendations = images.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DDD8CE] shadow-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7EBDD] text-[#46523A] text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#687453]"></span>
            <span>Member Portfolio Overview</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#242522]">
            Welcome back, {user?.display_name}!
          </h1>
          <p className="text-sm text-[#74746C] leading-relaxed mt-2">
            Your personal hub to manage favorite works, discover new photography submissions, and customize your profile preferences.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mt-6">
            <Link
              to="/gallery"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold transition shadow-xs"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Latest Photos</span>
            </Link>
            <Link
              to="/dashboard/favorites"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E7EBDD] hover:bg-[#d8decb] text-[#46523A] text-xs font-bold transition"
            >
              <Heart className="w-4 h-4 fill-current text-[#C76546]" />
              <span>View Saved ({favorites.size})</span>
            </Link>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="hidden lg:block absolute -right-6 -bottom-10 w-64 h-64 rounded-full bg-[#E7EBDD]/40 pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F4E0D7] text-[#C76546] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="block text-2xl font-serif font-bold text-[#242522]">
              {favorites.size}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74746C]">
              Saved Favorites
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E7EBDD] text-[#687453] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-serif font-bold text-[#242522]">
              {images.length}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74746C]">
              Gallery Collection
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EDE9E1] text-[#242522] flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-serif font-bold text-[#242522]">
              Member
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74746C]">
              Account Status
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Curations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#242522]">
              Recommended for You
            </h2>
            <p className="text-xs text-[#74746C] mt-0.5">
              Deterministic editorial curation from recent gallery highlights.
            </p>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-bold text-[#687453] hover:text-[#46523A] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((img, idx) => (
            <GalleryCard
              key={img.id}
              image={img}
              index={idx}
              onOpenLightbox={(i) => openLightbox(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
