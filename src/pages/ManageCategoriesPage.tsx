import React, { useState } from 'react';
import { useGallery } from '../context/GalleryContext';
import { Category } from '../types';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Plus, Pencil, Trash2, X, Save, FolderTree, AlertCircle } from 'lucide-react';

export const ManageCategoriesPage: React.FC = () => {
  const { categories, images, createCategory, updateCategory, deleteCategory, addToast } = useGallery();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setCoverUrl('');
    setErrorNotice('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setCoverUrl(cat.cover_image_url || '');
    setErrorNotice('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');

    if (!name.trim()) {
      setErrorNotice('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          cover_image_url: coverUrl.trim() || undefined,
        });
        setEditingCategory(null);
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim(),
          cover_image_url: coverUrl.trim() || undefined,
          slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
        setIsAddOpen(false);
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Operation failed.');
    }
  };

  const handleDeleteClick = (catId: string) => {
    // Check if category has images
    const hasImages = images.some((img) => img.category_id === catId);
    if (hasImages) {
      addToast(
        'Cannot delete category: existing photographs are linked to it. Reassign or delete those photographs first.',
        'warning'
      );
      return;
    }
    setDeletingId(catId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCategory(deletingId);
      setDeletingId(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD8CE]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#242522]">Manage Categories</h1>
          <p className="text-sm text-[#74746C] mt-1">
            Create and edit photography genres and thematic collections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = images.filter(
            (img) =>
              img.category_id.toLowerCase() === cat.id.toLowerCase() ||
              img.category_id.toLowerCase() === (cat.slug || '').toLowerCase() ||
              img.category_name?.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#DDD8CE] shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-16/9 bg-[#EDE9E1] overflow-hidden">
                {cat.cover_image_url ? (
                  <img
                    src={cat.cover_image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#74746C]">
                    <FolderTree className="w-8 h-8 text-[#687453]" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white rounded-full text-[11px] font-bold">
                  {count} Photos
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#242522]">{cat.name}</h3>
                  <p className="text-xs text-[#74746C] leading-relaxed mt-1.5">{cat.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#DDD8CE] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#74746C]">
                    /{cat.slug || cat.name.toLowerCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-[#74746C] hover:text-[#242522] hover:bg-[#EDE9E1] rounded-lg transition"
                      title="Edit Category"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cat.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {(isAddOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#DDD8CE] relative">
            <button
              onClick={() => {
                setIsAddOpen(false);
                setEditingCategory(null);
              }}
              className="absolute top-6 right-6 p-1 text-[#74746C] hover:text-[#242522] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#242522] mb-1">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>
            <p className="text-xs text-[#74746C] mb-5">
              Define the thematic label and visual narrative for this category.
            </p>

            {errorNotice && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-[#B42318]">
                {errorNotice}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aerial Landscapes"
                  className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#242522] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief editorial summary of this category..."
                  className="w-full px-3.5 py-2 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-xs text-[#242522] focus:outline-none focus:border-[#C76546]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DDD8CE]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#74746C] hover:text-[#242522]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold transition shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Category Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete Category"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
