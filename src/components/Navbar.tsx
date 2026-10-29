import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  Camera, 
  Heart, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { favorites } = useGallery();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Local Demo Mode Notice Banner if Supabase is not configured */}
      {!isSupabaseConfigured && (
        <div className="bg-[#1E201E] text-[#B7B9B0] text-xs py-1.5 px-4 text-center border-b border-[#41443F] flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C76546] animate-pulse"></span>
          <span>
            <strong>Local Demo Mode Active:</strong> Running with browser storage. Sign in with{' '}
            <code className="text-[#C7A56B] bg-white/5 px-1 py-0.5 rounded">member@pixora.gallery</code> or{' '}
            <code className="text-[#C7A56B] bg-white/5 px-1 py-0.5 rounded">admin@pixora.gallery</code>.
          </span>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#DDD8CE]'
            : 'bg-[#FAF7F2] border-b border-[#DDD8CE]/60'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C76546] rounded-lg p-1"
            aria-label="Pixora Gallery Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C76546] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#242522]">
                Pixora
              </span>
              <span className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#687453] -mt-1">
                Editorial Gallery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[#C76546] font-semibold' : 'text-[#74746C] hover:text-[#242522]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className={`text-sm font-medium transition-colors ${
                isActive('/gallery') ? 'text-[#C76546] font-semibold' : 'text-[#74746C] hover:text-[#242522]'
              }`}
            >
              Explore Gallery
            </Link>
            <Link
              to="/favorites"
              className={`text-sm font-medium transition-colors ${
                isActive('/favorites') ? 'text-[#C76546] font-semibold' : 'text-[#74746C] hover:text-[#242522]'
              }`}
            >
              Favorites
            </Link>
            <a
              href="/#about"
              className="text-sm font-medium text-[#74746C] hover:text-[#242522] transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Favorites Pill */}
            <Link
              to="/favorites"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDD8CE] text-[#242522] text-xs font-semibold hover:border-[#C76546] transition-colors shadow-2xs"
              title="View your saved favorites"
            >
              <Heart className="w-4 h-4 text-[#C76546] fill-[#C76546]" />
              <span>Saved</span>
              <span className="bg-[#C76546] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {favorites.size}
              </span>
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E201E] text-white text-xs font-semibold hover:bg-[#292C29] transition shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C7A56B]" />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E7EBDD] text-[#46523A] text-xs font-semibold hover:bg-[#d8decb] transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{user.display_name.split(' ')[0]}</span>
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="p-2 text-[#74746C] hover:text-[#B42318] hover:bg-rose-50 rounded-lg transition"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#242522] hover:text-[#C76546] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-[#C76546] hover:bg-[#A94E34] text-white rounded-full transition shadow-xs"
                >
                  Join Pixora
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/favorites"
              className="p-2 text-[#C76546] relative"
              aria-label="Saved favorites"
            >
              <Heart className="w-5 h-5 fill-current" />
              {favorites.size > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C76546] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.size}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#242522] hover:bg-black/5 rounded-lg transition"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#DDD8CE] bg-[#FAF7F2] px-6 py-5 shadow-lg animate-toast-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className={`text-base font-medium ${isActive('/') ? 'text-[#C76546] font-bold' : 'text-[#242522]'}`}
              >
                Home
              </Link>
              <Link
                to="/gallery"
                className={`text-base font-medium ${isActive('/gallery') ? 'text-[#C76546] font-bold' : 'text-[#242522]'}`}
              >
                Explore Gallery
              </Link>
              <Link
                to="/favorites"
                className={`text-base font-medium flex items-center justify-between ${
                  isActive('/favorites') ? 'text-[#C76546] font-bold' : 'text-[#242522]'
                }`}
              >
                <span>Favorites</span>
                <span className="bg-[#C76546] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {favorites.size}
                </span>
              </Link>
              <a href="/#about" className="text-base font-medium text-[#242522]">
                About Project
              </a>

              <hr className="border-[#DDD8CE] my-1" />

              {isAuthenticated && user ? (
                <div className="flex flex-col gap-3">
                  <div className="text-xs text-[#74746C]">
                    Signed in as <strong>{user.display_name}</strong> ({user.role})
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 py-2 px-3 bg-[#1E201E] text-white text-sm font-semibold rounded-lg"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C7A56B]" />
                      <span>Administrator Dashboard</span>
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 py-2 px-3 bg-[#E7EBDD] text-[#46523A] text-sm font-semibold rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span>Member Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 py-2 px-3 text-[#B42318] text-sm font-semibold hover:bg-rose-50 rounded-lg transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-2">
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 text-sm font-semibold text-[#242522] border border-[#DDD8CE] rounded-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 text-sm font-semibold bg-[#C76546] text-white rounded-full shadow-xs"
                  >
                    Join Pixora
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
