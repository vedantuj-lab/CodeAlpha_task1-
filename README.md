# Pixora Gallery

> **"Every Image Tells a Story."**

A production-grade, responsive full-stack photography platform developed for the **CodeAlpha Frontend Development Internship**. Pixora Gallery enables visitors to explore and discover world-class curated photography, members to manage personal favorite collections, and administrators to curate and manage imagery and categories through role-protected workflows.

---

## 📌 Problem & Purpose

Photography discovery platforms often suffer from cluttered dashboards, bloated interface elements, slow filtering pipelines, and inaccessible media viewports that distract from the art itself.

**Pixora Gallery** addresses this with an editorial-first design philosophy:
- **Photographs Remain the Focus**: Warm off-white palettes (`#F7F5F0`), rich charcoal typography (`#242522`), terracotta calls-to-action (`#C76546`), and natural olive accents (`#687453`).
- **Unified Single-Source Architecture**: Visitors, members, and administrators interact with the exact same live gallery dataset.
- **Zero Friction Browsing**: Instant client-side search across multiple fields, category filtering, and accessible full-screen image viewing with keyboard navigation.
- **Dual Persistence Strategy**: Native Supabase PostgreSQL & Auth integration with a built-in interactive LocalStorage Demo Mode when cloud credentials are not yet configured.

---

## ✨ Comprehensive Features

### 1. Editorial Landing Page
- **Navigation Bar**: Sticky blur transition, aperture emblem, navigation links, and real-time saved count badge.
- **Hero Showcase**: Headline (*"Discover the World, One Frame at a Time"*), editorial quote, smooth-scroll CTA, and live metrics tracking curated works, categories, and saved favorites.
- **Featured Work Card**: High-visibility showcase card with live metadata and one-click full-screen inspection.
- **Category Exploration**: Thematic cards for Nature, Architecture, Wildlife, Travel, and Street with dynamic photo counts.
- **Gallery Preview**: Selection of latest additions with quick lightbox viewing.
- **The Pixora Standard**: Four core pillars (Easy Discovery, Curated Categories, Full-Screen Viewing, Personal Favorites).
- **Community CTA & About Section**: Internship details and technical specifications.

### 2. Public Image Gallery
- **Multi-Field Live Search**: Instant search by image title, description, tags, location, photographer, and category.
- **Category Filter Tabs**: All Photos, Nature, Architecture, Wildlife, Travel, Street, and a dedicated **★ Saved Favorites** filter with dynamic count badges.
- **Dynamic Sorting**: Order photographs by Featured First, Newest Additions, Title (A–Z), and Title (Z–A).
- **Responsive Layout**: Fluid CSS Grid adapting from single-column on mobile (360px) to 4-column on desktop (1440px+).
- **Loading & Fallbacks**: Shimmer skeleton placeholder while loading and graceful fallback visual if a remote asset is unreachable.

### 3. Accessible Fullscreen Lightbox
- **Full-Viewport Dialog**: Deep atmospheric overlay (`rgba(18, 18, 16, 0.95)`) with locked background scrolling.
- **Story & Meta Drawer**: High-resolution image, title, category, photographer, location, camera specs, and storytelling narrative.
- **Position Tracking**: Dynamic counter (*"Photo X of Y"*) respecting the active filtered list.
- **Keyboard Navigation**:
  - `Escape`: Closes the lightbox and restores focus to the triggering card.
  - `ArrowLeft` / `ArrowRight`: Navigate between photos with circular wrapping (first ↔ last).
  - `F`: Toggle Fullscreen view mode.
- **Backdrop Dismissal**: Clicking the backdrop closes the overlay; clicking the photo or caption does not trigger dismissal (`stopPropagation`).
- **Truthful CORS Download**: Attempts direct file download via `fetch()` Blob. If remote CDN headers restrict direct client-side blob creation, Pixora truthfully explains the limitation via toast notification and opens the full-resolution asset in a new tab for direct saving without false success claims.

### 4. Favorites & Collection Management
- **One-Click Favoriting**: Toggle favorites from card overlays, hero showcase, or inside the lightbox.
- **Account Association**: Linked to authenticated members in the database (or locally for guest browsing).
- **Favorites Page**: Dedicated page with instant search within saved items and one-click removal.

### 5. Role-Based Authentication & Permissions
- **Distinct Visual Themes**:
  - Public & Member: Warm off-white (`#F7F5F0`), cream (`#EDE9E1`), terracotta, and olive.
  - Authentication: Deep charcoal (`#1E201E`) split-screen layout with editorial photography backdrop.
  - Admin Dashboard: Deep charcoal sidebar (`#1E201E`), gold accents (`#C7A56B`), and terracotta actions.
- **Role Enforcement**:
  - `member`: Can browse, search, manage personal favorites, and edit profile display name. Cannot modify global gallery content or access `/admin`.
  - `admin`: Can access `/admin`, add photographs, edit metadata, toggle featured spots, delete photographs, and manage categories.
- **One-Click Demo Credentials**:
  - Demo Member: `member@pixora.gallery` / `member123`
  - Demo Admin: `admin@pixora.gallery` / `admin123`

### 6. Administrator Dashboard & Management
- **Real-Time Statistics**: Total gallery images, categories, total favorites recorded, and featured works.
- **Manage Photographs**: Full table interface to add, edit, feature, or delete imagery with modal validation and confirmation dialogs.
- **Manage Categories**: Create and edit categories with safe deletion checks (prevents deleting categories that contain existing photographs).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 8, React Router DOM |
| **Styling & Design System** | Tailwind CSS v4, Custom CSS Design Tokens, Google Fonts (*Playfair Display* & *Inter*) |
| **Icons & UI** | Lucide React |
| **Backend & Database** | Supabase Authentication, PostgreSQL Database, Row Level Security (RLS) |
| **Fallback Storage** | LocalStorage API for standalone offline/demo operation |

---

## 📂 Project Structure

```
pixora-gallery/
├── index.html                   # HTML entry point with metadata and fonts
├── metadata.json                # Project capabilities and description
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS & React
├── .env.example                 # Environment variables template
├── .gitignore                   # Version control ignore list
├── README.md                    # Complete project documentation
│
├── supabase/
│   ├── migrations/
│   │   └── 20261029_init_pixora.sql   # PostgreSQL schema, RLS policies, indexes
│   └── seed.sql                       # Initial categories and photograph seed data
│
└── src/
    ├── types/
    │   └── index.ts             # TypeScript interfaces (User, Image, Category, Favorite)
    ├── styles/
    │   ├── design-tokens.css    # Color tokens and typography variables
    │   └── globals.css          # Tailwind imports and base styles
    ├── lib/
    │   └── supabase.ts          # Supabase client initialization & demo detection
    ├── data/
    │   └── sampleImages.ts      # Curated dataset of 25 photographs and 5 categories
    ├── services/
    │   ├── authService.ts       # Authentication service with role verification
    │   ├── galleryService.ts    # Image and category CRUD with dual persistence
    │   └── favoritesService.ts  # Favorite management and counts
    ├── context/
    │   ├── AuthContext.tsx      # User authentication context & session state
    │   └── GalleryContext.tsx   # Centralized gallery state, filters & toasts
    ├── components/
    │   ├── Navbar.tsx           # Responsive navigation with demo mode banner
    │   ├── Footer.tsx           # Dynamic footer with category links
    │   ├── GalleryCard.tsx      # Editorial card with skeleton and hover action
    │   ├── GalleryGrid.tsx      # Responsive CSS Grid
    │   ├── CategoryFilters.tsx  # Dynamic category pills with live count badges
    │   ├── SearchBar.tsx        # Instant search input with clear button
    │   ├── FavoriteButton.tsx   # Heart icon with animated toggle
    │   ├── Lightbox.tsx         # Accessible fullscreen modal viewer
    │   ├── LoadingState.tsx     # Skeleton loading state
    │   ├── EmptyState.tsx       # Informative empty search/filter state
    │   ├── ConfirmDialog.tsx    # Accessible confirmation dialog
    │   └── Toast.tsx            # Toast notification container
    ├── layouts/
    │   ├── PublicLayout.tsx     # Layout for visitors and public browsing
    │   ├── MemberLayout.tsx     # Member dashboard layout with olive accents
    │   └── AdminLayout.tsx      # Admin dashboard layout with dark sidebar
    ├── pages/
    │   ├── LandingPage.tsx      # Editorial landing page
    │   ├── GalleryPage.tsx      # Public photography exploration
    │   ├── FavoritesPage.tsx    # Saved collection view
    │   ├── LoginPage.tsx        # Split-screen login with demo shortcuts
    │   ├── RegisterPage.tsx     # Registration with member role enforcement
    │   ├── MemberDashboard.tsx  # Member overview & recommendations
    │   ├── ProfilePage.tsx      # Profile settings and display name editing
    │   ├── AdminDashboard.tsx   # Curator stats & overview
    │   ├── ManageImagesPage.tsx # Administrative image CRUD
    │   └── ManageCategoriesPage.tsx # Administrative category management
    ├── App.tsx                  # Application route definitions
    └── main.tsx                 # React DOM mount point
```

---

## ⚡ Instructions for Running Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<YOUR_USERNAME>/CodeAlpha_ImageGallery.git
cd CodeAlpha_ImageGallery
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
- If you have a Supabase project, populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- If omitted, **Pixora automatically runs in Local Demo Mode** with full functionality and persistent browser storage.

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup & Database Configuration

To connect Pixora Gallery to a live Supabase project:

1. **Create a Supabase Project**:
   - Go to [database.new](https://database.new) and create a free project.
2. **Execute Database Migrations**:
   - In your Supabase Dashboard, open the **SQL Editor**.
   - Copy the contents of `supabase/migrations/20261029_init_pixora.sql` and run it. This creates:
     - `profiles`, `categories`, `images`, and `favorites` tables.
     - Row Level Security (RLS) policies enforcing read/write permissions.
     - Fast lookup indexes on foreign keys.
3. **Execute Seed Data (Optional)**:
   - In the SQL Editor, paste and run `supabase/seed.sql` to populate initial categories and photographs.
4. **Copy API Keys**:
   - In Supabase Settings > **API**, copy Project URL and Project Anon Key into your `.env`:
     ```env
     VITE_SUPABASE_URL="https://your-project.supabase.co"
     VITE_SUPABASE_ANON_KEY="your-anon-key"
     ```

---

## 🧪 Testing Checklist & Verification Results

| Test Scenario | Verification Status | Notes |
| :--- | :--- | :--- |
| **Initial Compilation** | ✅ PASSED | `npm run build` succeeds cleanly via Vite. |
| **TypeScript Validation** | ✅ PASSED | `npm run lint` (`tsc --noEmit`) passes with 0 errors. |
| **Landing Page Flow** | ✅ PASSED | Hero CTA opens gallery; category cards filter gallery; featured photos open lightbox. |
| **Search & Filter Coexistence** | ✅ PASSED | Search query matches across titles, stories, locations, and photographers concurrently with active category. |
| **Clear Search** | ✅ PASSED | One-click clear button resets query and restores full list immediately. |
| **Empty State** | ✅ PASSED | Informative empty state with *"Reset All Filters"* action appears when 0 results match. |
| **Fullscreen Lightbox** | ✅ PASSED | Previous/next buttons cycle with wrapping; `Escape`, `ArrowLeft`, `ArrowRight`, and `F` work; backdrop click closes modal. |
| **Favorites Persistence** | ✅ PASSED | Saves across cards, lightbox, and featured card; persists across page reloads. |
| **Download & CORS** | ✅ PASSED | Gracefully catches remote CORS blocks, displays informative toast, and opens high-res image in new tab. |
| **Member vs Admin Access** | ✅ PASSED | Member dashboard restricted to authenticated users; admin dashboard blocks non-admins; demo logins functional. |
| **Curator CRUD** | ✅ PASSED | Admin can add new photos, edit metadata, delete with confirmation, and create categories with duplicate checks. |
| **Responsive Design** | ✅ PASSED | Tested and fluid across 360px, 390px, 768px, 1024px, and 1440px with zero horizontal overflow. |

---

## 🐙 Publishing to GitHub

```bash
# 1. Initialize Git repository
git init
git add .
git commit -m "feat: complete Pixora Gallery platform for CodeAlpha Internship"

# 2. Link to your GitHub repository
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/CodeAlpha_ImageGallery.git
git push -u origin main
```

---

## 🌐 Deployment Instructions (Vercel)

1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Configure Project Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! Vercel will build and serve your application with global edge performance.

---

## 🎓 Internship Attribution

- **Internship Program**: CodeAlpha Frontend Development Internship
- **Task Assigned**: Task 1 — Image Gallery Website
- **Candidate Submission**: Pixora Gallery
- **License**: MIT Open Source License
