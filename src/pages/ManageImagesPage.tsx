import React, { useState } from 'react';
import { useGallery } from '../context/GalleryContext';
import { GalleryImage } from '../types';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Sparkles, 
  Search, 
  X, 
  Save, 
  MapPin, 
  Camera as CameraIcon 
} from 'lucide-react';

export const ManageImagesPage: React.FC = () => {
  const { images, categories, createImage, updateImage, deleteImage, addToast } = useGallery();

  const [search, setSearch] = useState('');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category_id: categories[0]?.id || 'cat-nature',
    photographer: '',
    location: '',
    camera: '',
    tags: '',
    is_featured: false,
    aspect_ratio: 'landscape' as 'landscape' | 'portrait' | 'square',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = images.filter((img) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      img.title.toLowerCase().includes(q) ||
      img.category_name?.toLowerCase().includes(q) ||
      img.photographer.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category_id: categories[0]?.id || 'cat-nature',
      photographer: 'Editorial Contributor',
      location: 'Global',
      camera: 'Sony A7 IV • 24-70mm f/2.8',
      tags: 'nature, landscape',
      is_featured: false,
      aspect_ratio: 'landscape',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setFormData({
      title: img.title,
      description: img.description,
      image_url: img.image_url,
      category_id: img.category_id,
      photographer: img.photographer,
      location: img.location,
      camera: img.camera || '',
      tags: img.tags.join(', '),
      is_featured: img.is_featured,
      aspect_ratio: img.aspect_ratio || 'landscape',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.image_url.trim()) errors.image_url = 'Image URL is required';
    if (!formData.category_id) errors.category_id = 'Category is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      if (editingImage) {
        await updateImage(editingImage.id, {
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          category_id: formData.category_id,
          photographer: formData.photographer,
          location: formData.location,
          camera: formData.camera,
          tags: parsedTags,
          is_featured: formData.is_featured,
          aspect_ratio: formData.aspect_ratio,
        });
        setEditingImage(null);
      } else {
        await createImage({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          category_id: formData.category_id,
          photographer: formData.photographer || 'Editorial Contributor',
          location: formData.location || 'Global',
          camera: formData.camera,
          tags: parsedTags,
          is_featured: formData.is_featured,
          aspect_ratio: formData.aspect_ratio,
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleToggleFeatured = async (img: GalleryImage) => {
    try {
      await updateImage(img.id, { is_featured: !img.is_featured });
    } catch (err: any) {
      addToast('Failed to update featured status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteImage(deletingId);
      setDeletingId(null);
    } catch (err: any) {
      addToast('Failed to delete photograph', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD8CE]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#242522]">Manage Photographs</h1>
          <p className="text-sm text-[#74746C] mt-1">
            Add new works, update existing metadata, and manage curated featured spots.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photograph</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, photographer..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#DDD8CE] rounded-full text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
          />
        </div>
        <span className="text-xs text-[#74746C]">
          Showing <strong>{filtered.length}</strong> of {images.length} items
        </span>
      </div>

      {/* Photographs Table */}
      <div className="bg-white rounded-2xl border border-[#DDD8CE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F0] text-[#74746C] uppercase font-bold tracking-wider border-b border-[#DDD8CE]">
              <tr>
                <th className="py-3.5 px-5">Work</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Photographer</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5 text-center">Featured</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8CE]">
              {filtered.map((img) => (
                <tr key={img.id} className="hover:bg-[#F7F5F0]/50 transition">
                  <td className="py-3 px-5 flex items-center gap-3">
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-12 h-9 rounded object-cover bg-[#EDE9E1] shrink-0"
                    />
                    <div>
                      <p className="font-bold text-[#242522] truncate max-w-xs">{img.title}</p>
                      <p className="text-[11px] text-[#74746C] truncate max-w-xs">{img.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="px-2 py-0.5 rounded-full bg-[#E7EBDD] text-[#46523A] font-semibold text-[11px]">
                      {img.category_name}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-[#74746C]">{img.photographer}</td>
                  <td className="py-3 px-5 text-[#74746C]">{img.location}</td>
                  <td className="py-3 px-5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(img)}
                      className={`p-1.5 rounded-lg transition ${
                        img.is_featured
                          ? 'bg-[#1E201E] text-[#C7A56B]'
                          : 'bg-[#EDE9E1] text-[#74746C] hover:text-[#242522]'
                      }`}
                      title={img.is_featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(img)}
                        className="p-1.5 text-[#74746C] hover:text-[#242522] hover:bg-[#EDE9E1] rounded-lg transition"
                        title="Edit metadata"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(img.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                        title="Delete photograph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Dialog */}
      {(isAddModalOpen || editingImage) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#DDD8CE] relative my-8">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingImage(null);
              }}
              className="absolute top-6 right-6 p-1 text-[#74746C] hover:text-[#242522] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#242522] mb-1">
              {editingImage ? 'Edit Photograph' : 'Add New Photograph'}
            </h2>
            <p className="text-xs text-[#74746C] mb-6">
              Fill out the editorial metadata. Changes appear across the public gallery and member accounts immediately.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dawn Gondolas of the Grand Canal"
                  className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                />
                {formErrors.title && <p className="text-[11px] text-rose-600 mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                  Image Source URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                />
                {formErrors.image_url && <p className="text-[11px] text-rose-600 mt-1">{formErrors.image_url}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={formData.aspect_ratio}
                    onChange={(e) => setFormData({ ...formData, aspect_ratio: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                  >
                    <option value="landscape">Landscape (4:3)</option>
                    <option value="portrait">Portrait (3:4)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                    Photographer
                  </label>
                  <input
                    type="text"
                    value={formData.photographer}
                    onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                    placeholder="e.g. Matteo Rossi"
                    className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Venice, Italy"
                    className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                    Camera &amp; Lens
                  </label>
                  <input
                    type="text"
                    value={formData.camera}
                    onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                    placeholder="e.g. Sony A7R V • 24-70mm"
                    className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. mountains, sunrise, dolomites"
                  className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                  Editorial Story &amp; Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Evocative description of this photograph..."
                  className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-[#C76546] rounded focus:ring-[#C76546]"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-bold text-[#242522] cursor-pointer">
                  Feature this photograph prominently in hero showcases
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDD8CE]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingImage(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#74746C] hover:text-[#242522]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold transition shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingImage ? 'Save Changes' : 'Create Photograph'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Photograph"
        message="Are you sure you want to delete this photograph? It will be permanently removed from the public gallery and all saved user favorites."
        confirmLabel="Delete Permanently"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
