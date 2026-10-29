export type UserRole = 'member' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image_url?: string;
  created_at?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category_id: string;
  category_name?: string;
  tags: string[];
  photographer: string;
  location: string;
  camera?: string;
  is_featured: boolean;
  created_by?: string;
  created_at: string;
  aspect_ratio?: 'landscape' | 'portrait' | 'square';
}

export interface Favorite {
  id: string;
  user_id: string;
  image_id: string;
  created_at: string;
}

export type SortOption = 'featured' | 'newest' | 'title-asc' | 'title-desc';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
