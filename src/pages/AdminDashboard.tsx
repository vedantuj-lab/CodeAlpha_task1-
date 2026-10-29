import React from 'react';
import { Link } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { 
  Image as ImageIcon, 
  FolderTree, 
  Heart, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { images, categories, favorites, favoriteCounts } = useGallery();

  const featuredCount = images.filter((img) => img.is_featured).length;
  const totalFavsCount = Object.values(favoriteCounts).reduce((acc, c) => acc + c, 0);

  const recentImages = [...images]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD8CE]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C7A56B]">
            Curator Control Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#242522] mt-1">
            Gallery Management Overview
          </h1>
          <p className="text-sm text-[#74746C] mt-1">
            Review real-time gallery metrics, update imagery, and manage categories.
          </p>
        </div>

        <Link
          to="/admin/images"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photograph</span>
        </Link>
      </div>

      {/* Real Statistics Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EDE9E1] text-[#242522] flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-serif font-bold text-[#242522]">
              {images.length}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74746C]">
              Total Photographs
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E7EBDD] text-[#687453] flex items-center justify-center shrink-0">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-serif font-bold text-[#242522]">
              {categories.length}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74746C]">
              Categories
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1E201E] text-[#C7A56B] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-serif font-bold text-[#242522]">
              {featuredCount}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74746C]">
              Featured Works
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F4E0D7] text-[#C76546] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="block text-2xl font-serif font-bold text-[#242522]">
              {totalFavsCount}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74746C]">
              Favorites Recorded
            </span>
          </div>
        </div>
      </div>

      {/* Recent Photographs Table */}
      <div className="bg-white rounded-3xl border border-[#DDD8CE] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#DDD8CE] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#242522]">Recent Photographs</h2>
            <p className="text-xs text-[#74746C] mt-0.5">
              Latest items synchronized with the public gallery.
            </p>
          </div>
          <Link
            to="/admin/images"
            className="text-xs font-bold text-[#C76546] hover:text-[#A94E34] flex items-center gap-1"
          >
            <span>Manage All ({images.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F0] text-[#74746C] uppercase font-bold tracking-wider border-b border-[#DDD8CE]">
              <tr>
                <th className="py-3 px-6">Thumbnail &amp; Title</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Photographer</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6 text-center">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8CE]">
              {recentImages.map((img) => (
                <tr key={img.id} className="hover:bg-[#F7F5F0]/60 transition">
                  <td className="py-3.5 px-6 flex items-center gap-3">
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-12 h-9 rounded-lg object-cover bg-[#EDE9E1] shrink-0"
                    />
                    <span className="font-bold text-[#242522] truncate max-w-xs">{img.title}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E7EBDD] text-[#46523A] font-semibold text-[11px]">
                      {img.category_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-[#74746C]">{img.photographer}</td>
                  <td className="py-3.5 px-6 text-[#74746C]">{img.location}</td>
                  <td className="py-3.5 px-6 text-center">
                    {img.is_featured ? (
                      <span className="inline-block px-2 py-0.5 bg-[#1E201E] text-[#C7A56B] rounded text-[10px] font-bold">
                        FEATURED
                      </span>
                    ) : (
                      <span className="text-[#DDD8CE]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
