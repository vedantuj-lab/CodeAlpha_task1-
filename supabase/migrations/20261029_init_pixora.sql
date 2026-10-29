-- Pixora Gallery - Initial Supabase Database Schema & RLS Policies
-- CodeAlpha Frontend Development Internship

-- 1. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create Images Table
CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  tags TEXT[] DEFAULT '{}',
  photographer TEXT NOT NULL DEFAULT 'Editorial Contributor',
  location TEXT NOT NULL DEFAULT 'Global',
  camera TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  aspect_ratio TEXT DEFAULT 'landscape' CHECK (aspect_ratio IN ('landscape', 'portrait', 'square')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_image_favorite UNIQUE (user_id, image_id)
);

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_images_category ON public.images(category_id);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON public.images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_featured ON public.images(is_featured);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_image_id ON public.favorites(image_id);

-- 6. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 7. Helper Function: Is User Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RLS Policies: Profiles
-- Public can read basic profile info
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

-- Authenticated users can update their own profile (cannot alter role)
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- 9. RLS Policies: Categories
-- Anyone can view categories
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories" 
  ON public.categories FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" 
  ON public.categories FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" 
  ON public.categories FOR DELETE USING (public.is_admin());

-- 10. RLS Policies: Images
-- Anyone can view images
CREATE POLICY "Images are viewable by everyone" 
  ON public.images FOR SELECT USING (true);

-- Only admins can insert, update, or delete images
CREATE POLICY "Admins can insert images" 
  ON public.images FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update images" 
  ON public.images FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete images" 
  ON public.images FOR DELETE USING (public.is_admin());

-- 11. RLS Policies: Favorites
-- Authenticated users can view their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can add their own favorites
CREATE POLICY "Users can add favorites" 
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);
