import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { GalleryImage, Category, SortOption, ToastNotification } from '../types';
import { galleryService } from '../services/galleryService';
import { favoritesService } from '../services/favoritesService';
import { useAuth } from './AuthContext';

interface GalleryContextType {
  images: GalleryImage[];
  categories: Category[];
  favorites: Set<string>;
  favoriteCounts: Record<string, number>;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string; // 'All' | slug | 'favorites'
  setActiveCategory: (cat: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filteredImages: GalleryImage[];
  toggleFavorite: (imageId: string) => Promise<boolean>;
  createImage: (input: Omit<GalleryImage, 'id' | 'created_at'>) => Promise<GalleryImage>;
  updateImage: (id: string, updates: Partial<GalleryImage>) => Promise<GalleryImage>;
  deleteImage: (id: string) => Promise<boolean>;
  createCategory: (input: Omit<Category, 'id' | 'created_at'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;
  refreshGallery: () => Promise<void>;
  
  // Lightbox
  lightboxIndex: number | null;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextLightbox: () => void;
  prevLightbox: () => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteCounts, setFavoriteCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Toasts state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data
  const refreshGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const [imgs, cats, favCounts] = await Promise.all([
        galleryService.getImages(),
        galleryService.getCategories(),
        favoritesService.getFavoriteCounts(),
      ]);

      // Enrich images with category names if missing
      const enrichedImages = imgs.map((img) => {
        const cat = cats.find((c) => c.id === img.category_id || c.slug === img.category_id);
        return {
          ...img,
          category_name: cat ? cat.name : img.category_name || 'General',
        };
      });

      setImages(enrichedImages);
      setCategories(cats);
      setFavoriteCounts(favCounts);
    } catch (err) {
      console.error('Failed to load gallery data', err);
      addToast('Failed to load gallery data. Please refresh.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshGallery();
  }, [refreshGallery]);

  // Load user favorites whenever user changes
  useEffect(() => {
    async function loadUserFavorites() {
      if (user) {
        const userFavs = await favoritesService.getUserFavorites(user.id);
        setFavorites(new Set(userFavs));
      } else {
        // Guest user local storage favorites
        try {
          const raw = localStorage.getItem('pixora_guest_favs');
          const guestFavs = raw ? JSON.parse(raw) : [];
          setFavorites(new Set(guestFavs));
        } catch {
          setFavorites(new Set());
        }
      }
    }
    loadUserFavorites();
  }, [user]);

  // Toggle favorite
  const toggleFavorite = async (imageId: string): Promise<boolean> => {
    const isFav = favorites.has(imageId);
    const targetImg = images.find((i) => i.id === imageId);
    const title = targetImg ? targetImg.title : 'Photograph';

    if (user) {
      if (isFav) {
        await favoritesService.removeFavorite(user.id, imageId);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(imageId);
          return next;
        });
        setFavoriteCounts((prev) => ({
          ...prev,
          [imageId]: Math.max(0, (prev[imageId] || 1) - 1),
        }));
        addToast(`Removed "${title}" from your favorites.`, 'info');
      } else {
        await favoritesService.addFavorite(user.id, imageId);
        setFavorites((prev) => new Set(prev).add(imageId));
        setFavoriteCounts((prev) => ({
          ...prev,
          [imageId]: (prev[imageId] || 0) + 1,
        }));
        addToast(`Saved "${title}" to your favorites collection!`, 'success');
      }
      return !isFav;
    } else {
      // Guest favorite mode (stored locally, prompt to register)
      let nextFavs = new Set(favorites);
      if (isFav) {
        nextFavs.delete(imageId);
        addToast(`Removed "${title}" from local favorites.`, 'info');
      } else {
        nextFavs.add(imageId);
        addToast(`Saved "${title}" locally. Sign in to sync across sessions!`, 'success');
      }
      setFavorites(nextFavs);
      localStorage.setItem('pixora_guest_favs', JSON.stringify(Array.from(nextFavs)));
      return !isFav;
    }
  };

  // CRUD actions for images
  const createImage = async (input: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> => {
    const created = await galleryService.createImage({
      ...input,
      created_by: user?.id,
    });
    // Enrich with category name
    const cat = categories.find((c) => c.id === created.category_id || c.slug === created.category_id);
    const enriched = { ...created, category_name: cat?.name || 'General' };
    setImages((prev) => [enriched, ...prev]);
    addToast(`Photograph "${created.title}" added to gallery.`, 'success');
    return enriched;
  };

  const updateImage = async (id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> => {
    const updated = await galleryService.updateImage(id, updates);
    const cat = categories.find((c) => c.id === updated.category_id || c.slug === updated.category_id);
    const enriched = { ...updated, category_name: cat?.name || 'General' };
    setImages((prev) => prev.map((img) => (img.id === id ? enriched : img)));
    addToast(`Photograph "${updated.title}" updated.`, 'success');
    return enriched;
  };

  const deleteImage = async (id: string): Promise<boolean> => {
    await galleryService.deleteImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    addToast('Photograph removed from gallery.', 'info');
    return true;
  };

  // CRUD actions for categories
  const createCategory = async (input: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const newCat = await galleryService.createCategory(input);
    setCategories((prev) => [...prev, newCat]);
    addToast(`Category "${newCat.name}" created.`, 'success');
    return newCat;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
    const updated = await galleryService.updateCategory(id, updates);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    addToast(`Category "${updated.name}" updated.`, 'success');
    return updated;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    await galleryService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('Category deleted.', 'info');
    return true;
  };

  // Filtering & Sorting Pipeline
  const filteredImages = useMemo(() => {
    let result = [...images];

    // 1. Filter by category or favorites
    if (activeCategory === 'favorites') {
      result = result.filter((img) => favorites.has(img.id));
    } else if (activeCategory !== 'All') {
      result = result.filter(
        (img) =>
          img.category_id.toLowerCase() === activeCategory.toLowerCase() ||
          img.category_name?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // 2. Search query matching (title, description, tags, location, photographer, category)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((img) => {
        const titleMatch = img.title.toLowerCase().includes(q);
        const descMatch = img.description.toLowerCase().includes(q);
        const locMatch = img.location.toLowerCase().includes(q);
        const photogMatch = img.photographer.toLowerCase().includes(q);
        const catMatch = img.category_name?.toLowerCase().includes(q) || false;
        const tagMatch = img.tags.some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || locMatch || photogMatch || catMatch || tagMatch;
      });
    }

    // 3. Sorting
    if (sortBy === 'featured') {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [images, activeCategory, favorites, searchQuery, sortBy]);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    if (index >= 0 && index < filteredImages.length) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const value: GalleryContextType = {
    images,
    categories,
    favorites,
    favoriteCounts,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    filteredImages,
    toggleFavorite,
    createImage,
    updateImage,
    deleteImage,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshGallery,
    lightboxIndex,
    openLightbox,
    closeLightbox,
    nextLightbox,
    prevLightbox,
    toasts,
    addToast,
    removeToast,
  };

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
};

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
