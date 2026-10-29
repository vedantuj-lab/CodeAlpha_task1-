import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  SlidersHorizontal, 
  Maximize, 
  Heart, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { GalleryCard } from '../components/GalleryCard';

export const LandingPage: React.FC = () => {
  const { images, categories, favorites, setActiveCategory, openLightbox } = useGallery();
  const navigate = useNavigate();

  // Find featured images
  const featuredImages = images.filter((img) => img.is_featured);
  const heroImage = featuredImages[0] || images[0];
  const supportingFeatured = featuredImages.slice(1, 4);

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    navigate('/gallery');
  };

  return (
    <div className="flex flex-col">
      {/* SECTION 2: HERO */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col gap-6 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7EBDD] border border-[#687453]/20 text-[#46523A] text-xs font-semibold uppercase tracking-wider self-start">
                <span className="w-2 h-2 rounded-full bg-[#687453] animate-pulse"></span>
                <span>CodeAlpha Internship Showcase</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#242522] leading-[1.1]">
                Discover the World, <br />
                <span className="italic font-normal text-[#C76546]">One Frame</span> at a Time.
              </h1>

              <p className="font-serif text-lg sm:text-xl italic text-[#687453] border-l-2 border-[#C76546] pl-4 -mt-1">
                "Every image tells a story."
              </p>

              <p className="text-base sm:text-lg text-[#74746C] leading-relaxed max-w-xl">
                Explore extraordinary moments, remarkable places, and beautiful perspectives through a curated collection of photography.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/gallery"
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                >
                  <span>Explore Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#EDE9E1] border border-[#DDD8CE] text-[#242522] font-semibold text-sm sm:text-base transition"
                >
                  <span>Join the Community</span>
                </Link>
              </div>

              {/* Live Metrics Counter */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#DDD8CE] mt-4 max-w-lg">
                <div>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#242522]">
                    {images.length}
                  </span>
                  <span className="block text-xs uppercase font-semibold text-[#74746C] tracking-wider mt-1">
                    Curated Works
                  </span>
                </div>
                <div>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#242522]">
                    {categories.length}
                  </span>
                  <span className="block text-xs uppercase font-semibold text-[#74746C] tracking-wider mt-1">
                    Categories
                  </span>
                </div>
                <div>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C76546]">
                    {favorites.size}
                  </span>
                  <span className="block text-xs uppercase font-semibold text-[#74746C] tracking-wider mt-1">
                    Saved Favorites
                  </span>
                </div>
              </div>
            </div>

            {/* Right Featured Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              {heroImage && (
                <div
                  onClick={() => {
                    const idx = images.findIndex((i) => i.id === heroImage.id);
                    if (idx !== -1) openLightbox(idx);
                  }}
                  className="relative group bg-white p-3 sm:p-4 rounded-3xl border border-[#DDD8CE] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform lg:rotate-1 hover:rotate-0"
                >
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-[#EDE9E1]">
                    <img
                      src={heroImage.image_url}
                      alt={heroImage.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-[#C7A56B]" />
                      <span>Featured Showcase</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white opacity-95">
                      <span className="text-xs uppercase tracking-widest text-[#C7A56B] font-bold">
                        {heroImage.category_name}
                      </span>
                      <h3 className="font-serif text-2xl font-bold mt-1">{heroImage.title}</h3>
                      <p className="text-xs text-white/80 mt-1">
                        {heroImage.location} • By {heroImage.photographer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PHOTOGRAPHY */}
      <section className="py-20 bg-white border-y border-[#DDD8CE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C76546]">
                Curated Highlights
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#242522] mt-1">
                Featured Photography
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#687453] hover:text-[#46523A] transition"
            >
              <span>Explore all curated works</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportingFeatured.map((img) => (
              <GalleryCard
                key={img.id}
                image={img}
                index={images.findIndex((i) => i.id === img.id)}
                onOpenLightbox={(idx) => openLightbox(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CATEGORY EXPLORATION */}
      <section className="py-24 bg-[#F7F5F0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#687453]">
              Curated Anthologies
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#242522] mt-2 mb-4">
              Explore by Subject
            </h2>
            <p className="text-[#74746C] text-sm sm:text-base leading-relaxed">
              Every category captures a different facet of our visual world. Select any category to view full-resolution photographs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.slice(0, 5).map((cat) => {
              const photoCount = images.filter(
                (img) =>
                  img.category_id.toLowerCase() === cat.id.toLowerCase() ||
                  img.category_id.toLowerCase() === (cat.slug || '').toLowerCase() ||
                  img.category_name?.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug || cat.name)}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-[#DDD8CE] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#EDE9E1]">
                    {cat.cover_image_url ? (
                      <img
                        src={cat.cover_image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#EDE9E1] text-[#74746C]">
                        <Compass className="w-8 h-8 text-[#687453]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4 text-white">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {photoCount} Works
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#242522] group-hover:text-[#C76546] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#74746C] line-clamp-2 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                    <div className="pt-3 mt-2 border-t border-[#DDD8CE] flex items-center justify-between text-xs font-semibold text-[#687453]">
                      <span>Browse Anthology</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: GALLERY PREVIEW */}
      <section className="py-20 bg-white border-y border-[#DDD8CE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C76546]">
                Latest Additions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#242522] mt-1">
                Recent Perspectives
              </h2>
            </div>
            <Link
              to="/gallery"
              className="px-6 py-2.5 rounded-full bg-[#C76546] text-white text-sm font-semibold hover:bg-[#A94E34] transition shadow-xs self-start sm:self-auto"
            >
              View All Photos
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.slice(0, 8).map((img, index) => (
              <GalleryCard
                key={img.id}
                image={img}
                index={index}
                onOpenLightbox={(idx) => openLightbox(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY PIXORA */}
      <section className="py-24 bg-[#F7F5F0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#687453]">
              The Pixora Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#242522] mt-2 mb-4">
              Designed for Photography
            </h2>
            <p className="text-[#74746C] text-sm sm:text-base leading-relaxed">
              Every detail has been crafted so the imagery remains the focal point, backed by responsive engineering and accessible UX.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#DDD8CE] shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4E0D7] text-[#C76546] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#242522]">Easy Discovery</h3>
              <p className="text-sm text-[#74746C] leading-relaxed">
                Instant multi-field search and responsive category tabs allow exploration without friction or delay.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#DDD8CE] shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E7EBDD] text-[#687453] flex items-center justify-center">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#242522]">Curated Categories</h3>
              <p className="text-sm text-[#74746C] leading-relaxed">
                Nature, Architecture, Wildlife, Travel, and Street genres organized with dedicated editorial narratives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#DDD8CE] shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4E0D7] text-[#C76546] flex items-center justify-center">
                <Maximize className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#242522]">Full-Screen Viewing</h3>
              <p className="text-sm text-[#74746C] leading-relaxed">
                Immersive keyboard-accessible lightbox with wrapping arrow navigation and safe image download controls.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#DDD8CE] shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E7EBDD] text-[#687453] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#242522]">Personal Favorites</h3>
              <p className="text-sm text-[#74746C] leading-relaxed">
                Save inspiring moments with a single click, synchronized with user accounts and persistent across sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: COMMUNITY CALL TO ACTION */}
      <section className="py-20 bg-[#EDE9E1] border-y border-[#DDD8CE]">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C76546]">
            Start Collecting
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#242522]">
            Your Next Favorite Photograph Is Waiting.
          </h2>
          <p className="text-base text-[#74746C] max-w-xl leading-relaxed">
            Discover new perspectives, curate your own personal photography collection, and revisit the moments that inspire you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/gallery"
              className="px-8 py-3.5 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white font-semibold text-base shadow-md transition"
            >
              Explore Photos
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F7F5F0] border border-[#DDD8CE] text-[#242522] font-semibold text-base transition"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: ABOUT PROJECT */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F7F5F0] rounded-3xl p-8 sm:p-14 border border-[#DDD8CE] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7EBDD] text-[#46523A] text-xs font-bold mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#687453]" />
                <span>CodeAlpha Frontend Development Internship Submission</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#242522] mb-4">
                Engineered with Purpose and Precision
              </h2>
              <p className="text-sm sm:text-base text-[#74746C] leading-relaxed mb-4">
                Pixora Gallery was created to fulfill the Image Gallery requirements for the CodeAlpha Internship, featuring an end-to-end full-stack architecture with React, TypeScript, Tailwind CSS, and Supabase integration.
              </p>
              <p className="text-sm text-[#74746C] leading-relaxed">
                Key architectural hallmarks include zero-latency dual search &amp; category filtering, robust role-based access control (Members vs. Administrators), shared dataset synchronization, resilient LocalStorage demo fallback, and accessible full-screen image viewing.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDD8CE] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#242522]">Technical Specifications</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#74746C]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C76546] mt-2 shrink-0"></span>
                  <span><strong>Shared Single-Source Gallery:</strong> Unified data model between public browsing, member dashboards, and admin curators.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#687453] mt-2 shrink-0"></span>
                  <span><strong>Accessible Lightbox:</strong> Keyboard trapping, wrapping navigation, and background scroll locking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7A56B] mt-2 shrink-0"></span>
                  <span><strong>Hybrid Persistence:</strong> Native Supabase PostgreSQL &amp; Auth support with seamless browser fallback.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#287A52] mt-2 shrink-0"></span>
                  <span><strong>Editorial Design Tokens:</strong> Distinct warm cream, charcoal, terracotta, and olive palettes per role.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
