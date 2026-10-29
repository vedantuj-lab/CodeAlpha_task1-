import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Favorite } from '../types';

const STORAGE_KEY_FAVORITES = 'pixora_favorites_v2';

function loadStoredFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredFavorites(favs: Favorite[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favs));
  } catch (err) {
    console.error('Failed to save favorites to localStorage', err);
  }
}

export const favoritesService = {
  async getUserFavorites(userId: string): Promise<string[]> {
    if (!userId) return [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('image_id')
          .eq('user_id', userId);

        if (!error && data) {
          return data.map((item: any) => item.image_id);
        }
      } catch (err) {
        console.warn('Supabase favorites fetch failed, falling back to local store', err);
      }
    }

    const allFavs = loadStoredFavorites();
    return allFavs.filter((f) => f.user_id === userId).map((f) => f.image_id);
  },

  async addFavorite(userId: string, imageId: string): Promise<boolean> {
    if (!userId || !imageId) return false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('favorites')
          .upsert({ user_id: userId, image_id: imageId }, { onConflict: 'user_id,image_id' });
        if (!error) return true;
      } catch (err) {
        console.error('Supabase add favorite error', err);
      }
    }

    const allFavs = loadStoredFavorites();
    const exists = allFavs.some((f) => f.user_id === userId && f.image_id === imageId);
    if (!exists) {
      const newFav: Favorite = {
        id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        image_id: imageId,
        created_at: new Date().toISOString(),
      };
      saveStoredFavorites([...allFavs, newFav]);
    }
    return true;
  },

  async removeFavorite(userId: string, imageId: string): Promise<boolean> {
    if (!userId || !imageId) return false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('image_id', imageId);
        if (!error) return true;
      } catch (err) {
        console.error('Supabase remove favorite error', err);
      }
    }

    const allFavs = loadStoredFavorites();
    const filtered = allFavs.filter((f) => !(f.user_id === userId && f.image_id === imageId));
    saveStoredFavorites(filtered);
    return true;
  },

  async getFavoriteCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    const allFavs = loadStoredFavorites();
    allFavs.forEach((f) => {
      counts[f.image_id] = (counts[f.image_id] || 0) + 1;
    });
    return counts;
  },
};
