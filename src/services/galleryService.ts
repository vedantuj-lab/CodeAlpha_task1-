import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GalleryImage, Category } from '../types';
import { INITIAL_CATEGORIES, INITIAL_IMAGES } from '../data/sampleImages';

const STORAGE_KEY_IMAGES = 'pixora_gallery_images_v2';
const STORAGE_KEY_CATEGORIES = 'pixora_gallery_categories_v2';

function loadStoredImages(): GalleryImage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_IMAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(INITIAL_IMAGES));
      return INITIAL_IMAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_IMAGES;
  } catch {
    return INITIAL_IMAGES;
  }
}

function saveStoredImages(images: GalleryImage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(images));
  } catch (err) {
    console.error('Failed to save images to localStorage', err);
  }
}

function loadStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

function saveStoredCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage', err);
  }
}

export const galleryService = {
  async getImages(): Promise<GalleryImage[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('images')
          .select('*, categories(name)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((img: any) => ({
            id: img.id,
            title: img.title,
            description: img.description || '',
            image_url: img.image_url,
            category_id: img.category_id,
            category_name: img.categories?.name || 'Uncategorized',
            tags: img.tags || [],
            photographer: img.photographer || 'Editorial Contributor',
            location: img.location || 'Global',
            camera: img.camera,
            is_featured: img.is_featured || false,
            created_by: img.created_by,
            created_at: img.created_at,
            aspect_ratio: img.aspect_ratio || 'landscape',
          }));
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local dataset', err);
      }
    }
    return loadStoredImages();
  },

  async getImageById(id: string): Promise<GalleryImage | null> {
    const images = await this.getImages();
    return images.find((img) => img.id === id) || null;
  },

  async createImage(imageInput: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> {
    const newImage: GalleryImage = {
      ...imageInput,
      id: `img-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('images')
          .insert({
            title: newImage.title,
            description: newImage.description,
            image_url: newImage.image_url,
            category_id: newImage.category_id,
            tags: newImage.tags,
            photographer: newImage.photographer,
            location: newImage.location,
            camera: newImage.camera,
            is_featured: newImage.is_featured,
            aspect_ratio: newImage.aspect_ratio,
          })
          .select()
          .single();

        if (!error && data) {
          return {
            ...newImage,
            id: data.id,
            created_at: data.created_at,
          };
        }
      } catch (err) {
        console.error('Supabase image insert failed, saving to local store', err);
      }
    }

    const current = loadStoredImages();
    const updated = [newImage, ...current];
    saveStoredImages(updated);
    return newImage;
  },

  async updateImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('images')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.error('Supabase image update failed', err);
      }
    }

    const current = loadStoredImages();
    const index = current.findIndex((img) => img.id === id);
    if (index === -1) {
      throw new Error('Photograph not found');
    }

    const updatedImage = { ...current[index], ...updates };
    current[index] = updatedImage;
    saveStoredImages(current);
    return updatedImage;
  },

  async deleteImage(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('images').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase image delete failed', err);
      }
    }

    const current = loadStoredImages();
    const filtered = current.filter((img) => img.id !== id);
    saveStoredImages(filtered);
    return true;
  },

  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase categories fetch failed, using local store', err);
      }
    }
    return loadStoredCategories();
  },

  async createCategory(categoryInput: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const slug = categoryInput.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = {
      ...categoryInput,
      slug,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').insert(newCategory).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase category create failed', err);
      }
    }

    const current = loadStoredCategories();
    // Prevent duplicate name
    if (current.some((c) => c.name.toLowerCase() === categoryInput.name.toLowerCase())) {
      throw new Error(`Category "${categoryInput.name}" already exists.`);
    }

    const updated = [...current, newCategory];
    saveStoredCategories(updated);
    return newCategory;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase category update failed', err);
      }
    }

    const current = loadStoredCategories();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');

    const updatedCat = { ...current[index], ...updates };
    current[index] = updatedCat;
    saveStoredCategories(current);
    return updatedCat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    // Check if category has images
    const images = loadStoredImages();
    const hasImages = images.some((img) => img.category_id === id);
    if (hasImages) {
      throw new Error('Cannot delete category: existing photographs are linked to it. Reassign or delete those photographs first.');
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase category delete failed', err);
      }
    }

    const current = loadStoredCategories();
    const filtered = current.filter((c) => c.id !== id);
    saveStoredCategories(filtered);
    return true;
  },
};
