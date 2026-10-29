/**
 * Pixora Gallery - Core Application Script
 * CodeAlpha Frontend Development Internship Project
 * 
 * Features:
 * - Dynamic gallery rendering from data array
 * - Multi-category filtering with live count badges
 * - Instant case-insensitive search (title, category, story, location)
 * - Persistent favorites via localStorage with defensive error handling
 * - Accessible fullscreen lightbox with keyboard navigation (Esc, Left, Right)
 * - Safe image download with truthful CORS fallback
 * - Fullscreen viewing API support
 * - Image skeleton loaders & robust fallback handler
 * - Toast notification feedback
 */

(function () {
  'use strict';

  // --- Curated Photography Data Collection (26 High-Quality Works) ---
  const GALLERY_DATA = [
    {
      id: 'pix-01',
      title: 'Ethereal Mist in the Dolomites',
      category: 'Nature',
      description: 'Morning clouds drift through the dramatic jagged peaks of the Italian Alps, casting soft golden light across the alpine valley.',
      photographer: 'Luca Moretti',
      camera: 'Sony A7R V • 24-70mm f/2.8 GM',
      location: 'Val di Funes, Italy',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      isFeatured: true
    },
    {
      id: 'pix-02',
      title: 'Solitude of Mount Rainier',
      category: 'Nature',
      description: 'A towering volcanic peak crowned with ancient glaciers stands resilient against twilight hues and whispering pine forests.',
      photographer: 'Elena Rostova',
      camera: 'Canon EOS R5 • 70-200mm f/2.8L',
      location: 'Washington, USA',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-03',
      title: 'Whispers of the Forest Canopy',
      category: 'Nature',
      description: 'Dense fog weaves through emerald redwood treetops as the first rays of morning light pierce the quiet forest silence.',
      photographer: 'David K. Vance',
      camera: 'Nikon Z8 • 50mm f/1.8 S',
      location: 'Black Forest, Germany',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-04',
      title: 'Golden Slopes of Tuscany',
      category: 'Nature',
      description: 'Rolling hills dotted with slender cypress trees glow warm under the Mediterranean evening sun in peaceful serenity.',
      photographer: 'Marco Bellini',
      camera: 'Fujifilm GFX 100S • 32-64mm f/4',
      location: 'Val d\'Orcia, Italy',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-05',
      title: 'Emerald Horizon and Quiet Tide',
      category: 'Nature',
      description: 'Pristine turquoise waters gently wash over fine white sand along a secluded coastline surrounded by limestone cliffs.',
      photographer: 'Aria Lin',
      camera: 'Leica Q2 • 28mm f/1.7 Summilux',
      location: 'Krabi, Thailand',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-06',
      title: 'Misty Wilderness Reverie',
      category: 'Nature',
      description: 'Deep woodland ridges shrouded in rolling morning mist, showcasing the quiet poetry of undisturbed natural ecosystems.',
      photographer: 'Henrik Lindqvist',
      camera: 'Sony A7 IV • 100-400mm GM',
      location: 'Telemark, Norway',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-07',
      title: 'Geometric Ascent of Glass & Steel',
      category: 'Architecture',
      description: 'Reflective structural glass facades form rhythmic diagonal patterns that reach upward toward crisp blue skies.',
      photographer: 'Sophie Laurent',
      camera: 'Hasselblad X2D 100C • 45mm f/4',
      location: 'Frankfurt, Germany',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-08',
      title: 'Poetry in Minimalist Form',
      category: 'Architecture',
      description: 'Smooth curvilinear concrete structures frame light and shadow, demonstrating the emotional depth of minimalist interior design.',
      photographer: 'Kaito Tanaka',
      camera: 'Sony A7R IV • 16-35mm f/2.8 GM',
      location: 'Tokyo, Japan',
      aspectRatio: 'square',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-09',
      title: 'Symphony of Classical Arches',
      category: 'Architecture',
      description: 'Harmonious repetition of clean architectural colonnades creating an immersive corridor of linear perspective.',
      photographer: 'Julian Mercier',
      camera: 'Canon EOS 5D Mark IV • 24mm f/1.4L',
      location: 'Valencia, Spain',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-10',
      title: 'Monolithic Concrete Monolith',
      category: 'Architecture',
      description: 'Bold brutalist geometry where sharp angles and raw textured surfaces interact with shifting afternoon sunbeams.',
      photographer: 'Marek Nowak',
      camera: 'Nikon D850 • 14-24mm f/2.8G',
      location: 'Warsaw, Poland',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-11',
      title: 'Sanctuary of Contemporary Light',
      category: 'Architecture',
      description: 'Warm internal ambiance spills from floor-to-ceiling glass pavilions into tranquil twilight surroundings.',
      photographer: 'Hannah Wright',
      camera: 'Sony A1 • 35mm f/1.4 GM',
      location: 'Melbourne, Australia',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-12',
      title: 'Monarch of the Savannah',
      category: 'Wildlife',
      description: 'A powerful African lion rests attentively on a sunlit knoll, scanning the vast horizon with unmistakable calm authority.',
      photographer: 'Samuel Ochieng',
      camera: 'Nikon Z9 • 400mm f/2.8 TC VR',
      location: 'Serengeti, Tanzania',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-13',
      title: 'Gentle Guardian in Bamboo Shadows',
      category: 'Wildlife',
      description: 'A giant panda munches contentedly on fresh bamboo shoots, sheltered under the lush green canopy of a highland nature reserve.',
      photographer: 'Chen Wei',
      camera: 'Canon EOS R3 • 300mm f/2.8L',
      location: 'Sichuan, China',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-14',
      title: 'Crimson Hunter in Pure Frost',
      category: 'Wildlife',
      description: 'A vibrant red fox pauses mid-stride across freshly fallen snow, its keen amber eyes locked onto a subtle rustle.',
      photographer: 'Astrid Eriksen',
      camera: 'Sony A9 II • 600mm f/4 GM',
      location: 'Lappland, Sweden',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-15',
      title: 'Grizzly Sovereign in Rapids',
      category: 'Wildlife',
      description: 'A massive coastal brown bear navigates glacial river rapids during the annual wild salmon run with focused precision.',
      photographer: 'Caleb Morgan',
      camera: 'Nikon Z8 • 500mm f/4 VR',
      location: 'Katmai, Alaska',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-16',
      title: 'Vigilance of the Apex Hunter',
      category: 'Wildlife',
      description: 'Perched upon a windswept cliff, a bald eagle observes the open waters below, feathers ruffled by the crisp mountain breeze.',
      photographer: 'Rachel Adams',
      camera: 'Canon EOS R5 • 400mm f/2.8L',
      location: 'British Columbia, Canada',
      aspectRatio: 'square',
      url: 'https://images.unsplash.com/photo-1504595408478-3766a07ab08b?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1504595408478-3766a07ab08b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-17',
      title: 'Dawn Gondolas of the Grand Canal',
      category: 'Travel',
      description: 'Traditional handcrafted wooden gondolas bob peacefully at their moorings against the silhouette of Venetian palazzos in the pastel dawn.',
      photographer: 'Matteo Rossi',
      camera: 'Leica M11 • 35mm f/2 Summicron',
      location: 'Venice, Italy',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-18',
      title: 'Cerulean Terraces of Oia',
      category: 'Travel',
      description: 'Iconic whitewashed cubic villas and cobalt blue domes cascade gracefully down volcanic caldera cliffs into the glistening Aegean Sea.',
      photographer: 'Nikos Katsaros',
      camera: 'Fujifilm X-T5 • 16-55mm f/2.8',
      location: 'Santorini, Greece',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-19',
      title: 'Autumnal Ode to Mount Fuji',
      category: 'Travel',
      description: 'The iconic symmetrical cone of Mount Fuji rises proudly over Lake Kawaguchi, framed by blazing scarlet maple foliage.',
      photographer: 'Kenji Sato',
      camera: 'Sony A7R V • 24-105mm f/4 G',
      location: 'Yamanashi, Japan',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-20',
      title: 'Twilight Over the City of Lights',
      category: 'Travel',
      description: 'Golden boulevard illumination springs to life beneath the timeless iron lattice of the Eiffel Tower as dusk settles over Paris.',
      photographer: 'Camille Dubois',
      camera: 'Canon EOS R6 Mark II • 50mm f/1.2L',
      location: 'Paris, France',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-21',
      title: 'Lanterns of the Historic Alley',
      category: 'Travel',
      description: 'Intricately painted crimson lanterns illuminate stone alleyways lined with traditional teahouses and welcoming fragrances.',
      photographer: 'Mayumi Hayashi',
      camera: 'Sony A7C II • 35mm f/1.8',
      location: 'Kyoto, Japan',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-22',
      title: 'Rain, Puddles, and Yellow Cabs',
      category: 'Street',
      description: 'A sudden afternoon rainstorm transforms Manhattan tarmac into a glossy liquid mirror reflecting glowing traffic lights and bustling life.',
      photographer: 'Miles Thornton',
      camera: 'Leica Q2 Monochrom • 28mm f/1.7',
      location: 'New York City, USA',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-23',
      title: 'Silhouettes in Urban Neon',
      category: 'Street',
      description: 'A solitary pedestrian crosses an illuminated crosswalk as reflections of glowing neon signage paint the damp asphalt in electric tones.',
      photographer: 'Taro Yamada',
      camera: 'Fujifilm X-Pro3 • 23mm f/1.4',
      location: 'Shinjuku, Japan',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-24',
      title: 'Golden Hour Canyon of Skyscrapers',
      category: 'Street',
      description: 'Low-angled late afternoon sunlight streams between downtown monoliths, casting elongated shadows and gleaming metallic highlights.',
      photographer: 'Devon Carter',
      camera: 'Sony A7 IV • 85mm f/1.4 GM',
      location: 'Chicago, USA',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-25',
      title: 'Authentic Portrait in Daylight',
      category: 'Street',
      description: 'A striking candid portrait capturing genuine warmth and expressive emotion in natural ambient street illumination.',
      photographer: 'Amara Diallo',
      camera: 'Canon EOS R5 • 85mm f/1.2L DS',
      location: 'Lisbon, Portugal',
      aspectRatio: 'portrait',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pix-26',
      title: 'Celebration of Motion and Lights',
      category: 'Street',
      description: 'An energetic gathering captured with artistic motion blur, expressing the vibrant collective heartbeat of community night festivals.',
      photographer: 'Mateo Morales',
      camera: 'Sony A7S III • 35mm f/1.4 GM',
      location: 'Mexico City, Mexico',
      aspectRatio: 'landscape',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85',
      thumbUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // --- LocalStorage State Management ---
  const STORAGE_KEY = 'pixora_gallery_favorites_v1';

  /**
   * Safe retrieval of favorites array from localStorage
   * Protects against corrupted JSON or non-array data
   */
  function loadFavoritesFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return new Set();
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter(id => typeof id === 'string'));
      }
      return new Set();
    } catch (e) {
      console.warn('Pixora: Error reading favorites from localStorage, using empty state.', e);
      return new Set();
    }
  }

  /**
   * Persists favorites set to localStorage
   */
  function saveFavoritesToStorage(favoritesSet) {
    try {
      const arrayData = Array.from(favoritesSet);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayData));
    } catch (e) {
      console.error('Pixora: Failed to save favorites to localStorage', e);
    }
  }

  // --- Application State ---
  const state = {
    favorites: loadFavoritesFromStorage(),
    activeCategory: 'All', // 'All' | 'Nature' | 'Architecture' | 'Wildlife' | 'Travel' | 'Street' | 'Favorites'
    searchQuery: '',
    sortBy: 'default', // 'default' | 'title-asc' | 'title-desc' | 'category'
    filteredData: [...GALLERY_DATA],
    currentLightboxIndex: 0,
    previousActiveElement: null
  };

  // --- DOM Elements ---
  const elements = {
    header: document.querySelector('.site-header'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinksList: document.getElementById('navLinksList'),
    headerFavBtn: document.getElementById('headerFavBtn'),
    navFavCount: document.getElementById('navFavCount'),
    heroTotalCount: document.getElementById('heroTotalCount'),
    heroFavCount: document.getElementById('heroFavCount'),
    
    // Gallery Controls
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    filterPills: document.querySelectorAll('.filter-btn'),
    sortSelect: document.getElementById('sortSelect'),
    resultsCountText: document.getElementById('resultsCountText'),
    
    // Gallery Grid & Empty State
    galleryGrid: document.getElementById('galleryGrid'),
    emptyState: document.getElementById('emptyState'),
    emptyStateResetBtn: document.getElementById('emptyStateResetBtn'),
    
    // Lightbox Modal
    lightbox: document.getElementById('lightboxModal'),
    lightboxImg: document.getElementById('lightboxImg'),
    lightboxLoader: document.getElementById('lightboxLoader'),
    lightboxCounter: document.getElementById('lightboxCounter'),
    lightboxCategory: document.getElementById('lightboxCategory'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxMeta: document.getElementById('lightboxMeta'),
    lightboxStory: document.getElementById('lightboxStory'),
    lightboxFavBtn: document.getElementById('lightboxFavBtn'),
    lightboxDownloadBtn: document.getElementById('lightboxDownloadBtn'),
    lightboxFullscreenBtn: document.getElementById('lightboxFullscreenBtn'),
    lightboxCloseBtn: document.getElementById('lightboxCloseBtn'),
    lightboxPrevBtn: document.getElementById('lightboxPrevBtn'),
    lightboxNextBtn: document.getElementById('lightboxNextBtn'),

    // Featured Card
    featuredCard: document.getElementById('heroFeaturedCard'),
    featuredInspectBtn: document.getElementById('featuredInspectBtn'),
    featuredFavBtn: document.getElementById('featuredFavBtn'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // --- Utility Functions ---

  /**
   * Display accessible, non-blocking toast notifications
   */
  function showToast(message, type = 'info', duration = 3400) {
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    // Select icon
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);
  }

  /**
   * Escape HTML to prevent injection
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Create inline SVG fallback if image fails to load from remote host
   */
  function generateFallbackDataUrl(title, category) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
        <rect width="800" height="600" fill="#F3EDE3"/>
        <circle cx="400" cy="240" r="48" fill="#E2D8CA"/>
        <path d="M400 216c-13.25 0-24 10.75-24 24s10.75 24 24 24 24-10.75 24-24-10.75-24-24-24zm0 38c-7.73 0-14-6.27-14-14s6.27-14 14-14 14 6.27 14 14-6.27 14-14 14z" fill="#5B6A4E"/>
        <text x="400" y="340" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="#1D1B18" text-anchor="middle">${escapeHtml(title)}</text>
        <text x="400" y="380" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" letter-spacing="1.5" fill="#C25E42" text-anchor="middle">${escapeHtml(category).toUpperCase()} • PREVIEW OFFLINE</text>
      </svg>
    `;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
  }

  // --- Filtering & Search Logic ---

  /**
   * Calculate live counts for each category to display on filter badges
   */
  function updateCategoryFilterBadges() {
    const counts = {
      All: GALLERY_DATA.length,
      Nature: 0,
      Architecture: 0,
      Wildlife: 0,
      Travel: 0,
      Street: 0,
      Favorites: state.favorites.size
    };

    GALLERY_DATA.forEach(item => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    elements.filterPills.forEach(pill => {
      const category = pill.getAttribute('data-filter');
      const badge = pill.querySelector('.filter-count-badge');
      if (badge && counts[category] !== undefined) {
        badge.textContent = counts[category];
      }
    });

    if (elements.navFavCount) {
      elements.navFavCount.textContent = state.favorites.size;
    }
    if (elements.heroFavCount) {
      elements.heroFavCount.textContent = state.favorites.size;
    }
    if (elements.heroTotalCount) {
      elements.heroTotalCount.textContent = GALLERY_DATA.length;
    }

    // Update active state on header fav button
    if (elements.headerFavBtn) {
      if (state.activeCategory === 'Favorites') {
        elements.headerFavBtn.classList.add('active');
      } else {
        elements.headerFavBtn.classList.remove('active');
      }
    }
  }

  /**
   * Core filter & search evaluator
   */
  function applyFiltersAndSearch() {
    const query = state.searchQuery.trim().toLowerCase();

    state.filteredData = GALLERY_DATA.filter(item => {
      // 1. Category check
      if (state.activeCategory === 'Favorites') {
        if (!state.favorites.has(item.id)) return false;
      } else if (state.activeCategory !== 'All') {
        if (item.category.toLowerCase() !== state.activeCategory.toLowerCase()) {
          return false;
        }
      }

      // 2. Search query check
      if (query.length > 0) {
        const titleMatch = item.title.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const locMatch = item.location.toLowerCase().includes(query);
        const photogMatch = item.photographer.toLowerCase().includes(query);
        return titleMatch || catMatch || descMatch || locMatch || photogMatch;
      }

      return true;
    });

    // 3. Sorting
    if (state.sortBy === 'title-asc') {
      state.filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (state.sortBy === 'title-desc') {
      state.filteredData.sort((a, b) => b.title.localeCompare(a.title));
    } else if (state.sortBy === 'category') {
      state.filteredData.sort((a, b) => a.category.localeCompare(b.category));
    }

    renderGallery();
  }

  // --- Rendering Functions ---

  /**
   * Render the gallery cards into the DOM
   */
  function renderGallery() {
    const totalCount = GALLERY_DATA.length;
    const matchCount = state.filteredData.length;

    // Update results summary label
    if (elements.resultsCountText) {
      if (state.activeCategory === 'Favorites') {
        elements.resultsCountText.textContent = `Showing ${matchCount} of ${state.favorites.size} saved favorites`;
      } else if (state.searchQuery) {
        elements.resultsCountText.textContent = `Found ${matchCount} match${matchCount === 1 ? '' : 'es'} for "${state.searchQuery}"`;
      } else {
        elements.resultsCountText.textContent = `Showing ${matchCount} of ${totalCount} photographs`;
      }
    }

    // Toggle Empty State
    if (matchCount === 0) {
      elements.galleryGrid.innerHTML = '';
      elements.emptyState.classList.add('visible');

      const titleEl = elements.emptyState.querySelector('.empty-state-title');
      const descEl = elements.emptyState.querySelector('.empty-state-desc');

      if (state.activeCategory === 'Favorites') {
        if (titleEl) titleEl.textContent = 'Your Collection is Empty';
        if (descEl) descEl.textContent = 'You haven\'t saved any photographs yet. Click the heart icon on any photograph card or in the lightbox to save your favorite moments.';
      } else {
        if (titleEl) titleEl.textContent = 'No Photographs Found';
        if (descEl) descEl.textContent = `We couldn't find any results matching your current search or category filter. Try clearing your search or switching categories.`;
      }
      return;
    }

    elements.emptyState.classList.remove('visible');

    // Create fragment for high rendering performance
    const fragment = document.createDocumentFragment();

    state.filteredData.forEach((item, index) => {
      const isFav = state.favorites.has(item.id);
      const card = document.createElement('article');
      card.className = 'gallery-card';
      card.setAttribute('data-id', item.id);
      card.setAttribute('data-index', index);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View ${item.title} by ${item.photographer}`);

      // Aspect ratio class
      const ratioClass = item.aspectRatio || 'landscape';

      card.innerHTML = `
        <div class="card-media-wrapper ${ratioClass}">
          <img 
            src="${item.thumbUrl}" 
            alt="${escapeHtml(item.title)} - ${escapeHtml(item.category)} photography by ${escapeHtml(item.photographer)}"
            class="gallery-card-img"
            loading="lazy"
            decoding="async"
          />
          <div class="card-fallback-view" aria-hidden="true">
            <svg class="card-fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p class="card-fallback-text">${escapeHtml(item.title)}</p>
            <span class="card-fallback-sub">Preview offline</span>
          </div>
          
          <div class="card-overlay" aria-hidden="true">
            <div class="card-overlay-top">
              <span class="card-category-badge">${escapeHtml(item.category)}</span>
              <button 
                type="button" 
                class="card-fav-btn ${isFav ? 'is-active' : ''}" 
                data-action="toggle-fav" 
                data-id="${item.id}"
                aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
                title="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            
            <div class="card-overlay-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>View Fullscreen</span>
            </div>

            <div class="card-overlay-bottom">
              <div class="card-overlay-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${escapeHtml(item.location)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-content">
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <p class="card-description-preview">${escapeHtml(item.description)}</p>
          <div class="card-footer-meta">
            <span class="card-photographer">By ${escapeHtml(item.photographer)}</span>
            <span class="card-gear">${escapeHtml(item.category)}</span>
          </div>
        </div>
      `;

      // Handle image load shimmer & error fallback
      const imgEl = card.querySelector('.gallery-card-img');
      const mediaWrapper = card.querySelector('.card-media-wrapper');

      if (imgEl && mediaWrapper) {
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          mediaWrapper.classList.add('loaded');
        } else {
          imgEl.addEventListener('load', () => {
            mediaWrapper.classList.add('loaded');
          });
          imgEl.addEventListener('error', () => {
            mediaWrapper.classList.add('loaded');
            mediaWrapper.classList.add('has-error');
            imgEl.src = generateFallbackDataUrl(item.title, item.category);
          });
        }
      }

      // Card click opens Lightbox (unless favorite button is clicked)
      card.addEventListener('click', (e) => {
        const favBtn = e.target.closest('[data-action="toggle-fav"]');
        if (favBtn) {
          e.stopPropagation();
          toggleFavorite(item.id);
          return;
        }
        openLightbox(index, card);
      });

      // Card keyboard support (Enter or Space opens lightbox)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('[data-action="toggle-fav"]')) return;
          e.preventDefault();
          openLightbox(index, card);
        }
      });

      fragment.appendChild(card);
    });

    elements.galleryGrid.innerHTML = '';
    elements.galleryGrid.appendChild(fragment);
  }

  // --- Favorites Management ---

  /**
   * Toggle favorite status of a photograph
   */
  function toggleFavorite(id) {
    const photo = GALLERY_DATA.find(p => p.id === id);
    if (!photo) return;

    const isFav = state.favorites.has(id);
    if (isFav) {
      state.favorites.delete(id);
      showToast(`Removed "${photo.title}" from your favorites.`, 'info');
    } else {
      state.favorites.add(id);
      showToast(`Saved "${photo.title}" to your favorites collection!`, 'success');
    }

    saveFavoritesToStorage(state.favorites);
    updateCategoryFilterBadges();

    // Update heart icons on cards without full re-render if not in Favorites view
    if (state.activeCategory === 'Favorites') {
      applyFiltersAndSearch();
    } else {
      updateCardFavoriteUI(id, !isFav);
    }

    // Update hero featured card favorite if matching
    updateFeaturedCardFavUI(id);

    // Update lightbox fav button if open
    updateLightboxFavUI();
  }

  /**
   * Updates individual card heart icons
   */
  function updateCardFavoriteUI(id, isFav) {
    const cardFavBtn = document.querySelector(`.card-fav-btn[data-id="${id}"]`);
    if (cardFavBtn) {
      if (isFav) {
        cardFavBtn.classList.add('is-active');
        cardFavBtn.setAttribute('aria-label', 'Remove from favorites');
        cardFavBtn.setAttribute('title', 'Remove from favorites');
        const svg = cardFavBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'currentColor');
      } else {
        cardFavBtn.classList.remove('is-active');
        cardFavBtn.setAttribute('aria-label', 'Add to favorites');
        cardFavBtn.setAttribute('title', 'Add to favorites');
        const svg = cardFavBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'none');
      }
    }
  }

  /**
   * Updates hero featured card favorite button state
   */
  function updateFeaturedCardFavUI(id) {
    if (!elements.featuredFavBtn) return;
    const featuredPhoto = GALLERY_DATA.find(p => p.isFeatured) || GALLERY_DATA[0];
    if (featuredPhoto && (id === undefined || id === featuredPhoto.id)) {
      const isFav = state.favorites.has(featuredPhoto.id);
      if (isFav) {
        elements.featuredFavBtn.classList.add('is-active');
        elements.featuredFavBtn.setAttribute('aria-label', 'Remove from favorites');
        const svg = elements.featuredFavBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'currentColor');
      } else {
        elements.featuredFavBtn.classList.remove('is-active');
        elements.featuredFavBtn.setAttribute('aria-label', 'Add to favorites');
        const svg = elements.featuredFavBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'none');
      }
    }
  }

  // --- Lightbox Implementation ---

  /**
   * Open the lightbox modal at a specific index within state.filteredData
   */
  function openLightbox(index, triggerElement = null) {
    if (index < 0 || index >= state.filteredData.length) return;

    state.currentLightboxIndex = index;
    state.previousActiveElement = triggerElement || document.activeElement;

    // Lock background scroll
    document.body.classList.add('lightbox-open');

    // Show modal
    elements.lightbox.classList.add('is-open');
    elements.lightbox.setAttribute('aria-hidden', 'false');

    renderLightboxContent();

    // Trap focus inside lightbox (focus the close button)
    setTimeout(() => {
      if (elements.lightboxCloseBtn) {
        elements.lightboxCloseBtn.focus();
      }
    }, 50);
  }

  /**
   * Render the current photograph inside the lightbox
   */
  function renderLightboxContent() {
    const item = state.filteredData[state.currentLightboxIndex];
    if (!item) return;

    const total = state.filteredData.length;
    const currentNum = state.currentLightboxIndex + 1;

    // Position counter & category
    if (elements.lightboxCounter) {
      elements.lightboxCounter.textContent = `Photo ${currentNum} of ${total}`;
    }
    if (elements.lightboxCategory) {
      elements.lightboxCategory.textContent = item.category;
    }

    // Titles & metadata
    if (elements.lightboxTitle) {
      elements.lightboxTitle.textContent = item.title;
    }
    if (elements.lightboxMeta) {
      elements.lightboxMeta.innerHTML = `
        <span>By <strong>${escapeHtml(item.photographer)}</strong></span>
        <span>•</span>
        <span>${escapeHtml(item.location)}</span>
        <span>•</span>
        <span>${escapeHtml(item.camera)}</span>
      `;
    }
    if (elements.lightboxStory) {
      elements.lightboxStory.textContent = item.description;
    }

    // Update favorite button state
    updateLightboxFavUI();

    // Load High-Res Image with spinner and error handling
    if (elements.lightboxImg && elements.lightboxLoader) {
      elements.lightboxImg.classList.remove('loaded');
      elements.lightboxLoader.classList.add('visible');

      // Setup temp image to avoid flickers
      const tempImg = new Image();
      tempImg.src = item.url;

      tempImg.onload = () => {
        elements.lightboxImg.src = item.url;
        elements.lightboxImg.alt = `${item.title} - ${item.category} photography by ${item.photographer}`;
        elements.lightboxImg.classList.add('loaded');
        elements.lightboxLoader.classList.remove('visible');
      };

      tempImg.onerror = () => {
        elements.lightboxImg.src = generateFallbackDataUrl(item.title, item.category);
        elements.lightboxImg.alt = `${item.title} (Preview unavailable)`;
        elements.lightboxImg.classList.add('loaded');
        elements.lightboxLoader.classList.remove('visible');
      };
    }
  }

  /**
   * Updates favorite button in Lightbox toolbar
   */
  function updateLightboxFavUI() {
    if (!elements.lightboxFavBtn) return;
    const item = state.filteredData[state.currentLightboxIndex];
    if (!item) return;

    const isFav = state.favorites.has(item.id);
    if (isFav) {
      elements.lightboxFavBtn.classList.add('active-fav');
      elements.lightboxFavBtn.setAttribute('aria-label', 'Remove photograph from favorites');
      elements.lightboxFavBtn.setAttribute('title', 'Remove photograph from favorites');
    } else {
      elements.lightboxFavBtn.classList.remove('active-fav');
      elements.lightboxFavBtn.setAttribute('aria-label', 'Add photograph to favorites');
      elements.lightboxFavBtn.setAttribute('title', 'Add photograph to favorites');
    }
  }

  /**
   * Navigate to next image with wrapping
   */
  function nextLightboxImage() {
    if (state.filteredData.length === 0) return;
    state.currentLightboxIndex = (state.currentLightboxIndex + 1) % state.filteredData.length;
    renderLightboxContent();
  }

  /**
   * Navigate to previous image with wrapping
   */
  function prevLightboxImage() {
    if (state.filteredData.length === 0) return;
    state.currentLightboxIndex = (state.currentLightboxIndex - 1 + state.filteredData.length) % state.filteredData.length;
    renderLightboxContent();
  }

  /**
   * Close the lightbox and restore focus
   */
  function closeLightbox() {
    elements.lightbox.classList.remove('is-open');
    elements.lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');

    // Restore focus to original triggering card
    if (state.previousActiveElement && typeof state.previousActiveElement.focus === 'function') {
      state.previousActiveElement.focus();
    }
  }

  /**
   * Graceful and truthful Image Download handler
   * Explains CORS reality truthfully without false success claims
   */
  async function downloadCurrentImage() {
    const item = state.filteredData[state.currentLightboxIndex];
    if (!item) return;

    showToast('Initiating high-resolution download...', 'info', 2000);

    try {
      const response = await fetch(item.url, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      const cleanFileName = item.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
      downloadAnchor.download = cleanFileName;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.URL.revokeObjectURL(blobUrl);

      showToast(`Downloaded "${item.title}" successfully!`, 'success');
    } catch (err) {
      console.info('Pixora: Direct blob download blocked by remote CORS header, falling back to direct tab view.', err);
      showToast('Direct download restricted by remote image server CORS. Opening original high-resolution photo in a new tab so you can save directly.', 'info', 6000);
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Toggle Fullscreen API with graceful fallback
   */
  function toggleFullscreen() {
    const targetElement = elements.lightbox;
    if (!targetElement) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (targetElement.requestFullscreen) {
        targetElement.requestFullscreen().catch(err => {
          showToast('Fullscreen mode was declined or not supported by your browser.', 'info');
        });
      } else if (targetElement.webkitRequestFullscreen) {
        targetElement.webkitRequestFullscreen();
      } else {
        showToast('Fullscreen API is not supported in this browser.', 'info');
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  // --- Event Listeners Setup ---

  function initializeEventListeners() {
    // 1. Category Filter Clicks
    elements.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const category = pill.getAttribute('data-filter');
        state.activeCategory = category;

        elements.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        applyFiltersAndSearch();
      });
    });

    // 2. Header Favorites Nav Button
    if (elements.headerFavBtn) {
      elements.headerFavBtn.addEventListener('click', () => {
        // Find Favorites pill and trigger click
        const favPill = document.querySelector('.filter-btn[data-filter="Favorites"]');
        if (favPill) {
          favPill.click();
          // Smooth scroll to gallery
          const gallerySection = document.getElementById('gallery');
          if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    // 3. Search Input Live Filtering
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (elements.searchClearBtn) {
          if (state.searchQuery.length > 0) {
            elements.searchClearBtn.classList.add('visible');
          } else {
            elements.searchClearBtn.classList.remove('visible');
          }
        }
        applyFiltersAndSearch();
      });

      // Keyboard shortcut: Press '/' to focus search
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== elements.searchInput && !elements.lightbox.classList.contains('is-open')) {
          e.preventDefault();
          elements.searchInput.focus();
        }
      });
    }

    // 4. Search Clear Button
    if (elements.searchClearBtn) {
      elements.searchClearBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        state.searchQuery = '';
        elements.searchClearBtn.classList.remove('visible');
        elements.searchInput.focus();
        applyFiltersAndSearch();
        showToast('Search query cleared', 'info', 1800);
      });
    }

    // 5. Empty State Reset Button
    if (elements.emptyStateResetBtn) {
      elements.emptyStateResetBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        state.searchQuery = '';
        if (elements.searchClearBtn) elements.searchClearBtn.classList.remove('visible');
        
        // Reset category to All
        const allPill = document.querySelector('.filter-btn[data-filter="All"]');
        if (allPill) allPill.click();
      });
    }

    // 6. Sort Selector
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        applyFiltersAndSearch();
      });
    }

    // 7. Lightbox Controls
    if (elements.lightboxCloseBtn) {
      elements.lightboxCloseBtn.addEventListener('click', closeLightbox);
    }
    if (elements.lightboxNextBtn) {
      elements.lightboxNextBtn.addEventListener('click', nextLightboxImage);
    }
    if (elements.lightboxPrevBtn) {
      elements.lightboxPrevBtn.addEventListener('click', prevLightboxImage);
    }
    if (elements.lightboxFavBtn) {
      elements.lightboxFavBtn.addEventListener('click', () => {
        const item = state.filteredData[state.currentLightboxIndex];
        if (item) toggleFavorite(item.id);
      });
    }
    if (elements.lightboxDownloadBtn) {
      elements.lightboxDownloadBtn.addEventListener('click', downloadCurrentImage);
    }
    if (elements.lightboxFullscreenBtn) {
      elements.lightboxFullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Backdrop click closes overlay (clicking dialog content does NOT close)
    if (elements.lightbox) {
      elements.lightbox.addEventListener('click', (e) => {
        // If clicking directly on the backdrop or the stage container (empty space)
        if (e.target === elements.lightbox || e.target.classList.contains('lightbox-body') || e.target.classList.contains('lightbox-stage-container')) {
          closeLightbox();
        }
      });
    }

    // 8. Global Keyboard Navigation (Lightbox Controls)
    window.addEventListener('keydown', (e) => {
      if (!elements.lightbox.classList.contains('is-open')) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextLightboxImage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevLightboxImage();
          break;
        case 'f':
        case 'F':
          // Toggle fullscreen
          if (e.target !== elements.searchInput) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'Tab':
          // Simple focus wrap within lightbox
          trapFocus(e);
          break;
      }
    });

    // 9. Mobile Menu Toggle
    if (elements.mobileMenuBtn && elements.navLinksList) {
      elements.mobileMenuBtn.addEventListener('click', () => {
        const isOpen = elements.navLinksList.classList.toggle('is-open');
        elements.mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      });

      // Close mobile menu when nav link is clicked
      elements.navLinksList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          elements.navLinksList.classList.remove('is-open');
          elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // 10. Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
    }, { passive: true });

    // 11. Hero Featured Photograph Card Actions
    if (elements.featuredInspectBtn) {
      elements.featuredInspectBtn.addEventListener('click', () => {
        const featuredPhoto = GALLERY_DATA.find(p => p.isFeatured) || GALLERY_DATA[0];
        // Ensure photo is in filtered list or switch to All
        const indexInFiltered = state.filteredData.findIndex(p => p.id === featuredPhoto.id);
        if (indexInFiltered !== -1) {
          openLightbox(indexInFiltered, elements.featuredInspectBtn);
        } else {
          const allPill = document.querySelector('.filter-btn[data-filter="All"]');
          if (allPill) allPill.click();
          const newIndex = state.filteredData.findIndex(p => p.id === featuredPhoto.id);
          openLightbox(newIndex !== -1 ? newIndex : 0, elements.featuredInspectBtn);
        }
      });
    }

    if (elements.featuredFavBtn) {
      elements.featuredFavBtn.addEventListener('click', () => {
        const featuredPhoto = GALLERY_DATA.find(p => p.isFeatured) || GALLERY_DATA[0];
        if (featuredPhoto) toggleFavorite(featuredPhoto.id);
      });
    }
  }

  /**
   * Traps Tab focus within the open Lightbox dialog
   */
  function trapFocus(e) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(elements.lightbox.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  // --- Application Bootstrap ---
  function init() {
    updateCategoryFilterBadges();
    updateFeaturedCardFavUI();
    renderGallery();
    initializeEventListeners();
    console.info('Pixora Gallery initialized successfully with 26 curated photographs.');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
