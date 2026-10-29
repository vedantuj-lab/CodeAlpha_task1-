import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Heart, Shield } from 'lucide-react';
import { useGallery } from '../context/GalleryContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { categories, setActiveCategory } = useGallery();

  return (
    <footer className="bg-[#1E201E] text-[#B7B9B0] border-t border-[#41443F] pt-16 pb-12 mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#41443F]/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C76546] text-white flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F6F4EE]">
                Pixora Gallery
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#B7B9B0]/90">
              "Every image tells a story." An editorial exhibition honoring the transformative dialogue between natural light, architecture, wildlife, and human emotion.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C7A56B] mt-2">
              <Shield className="w-4 h-4" />
              <span>Developed for CodeAlpha Frontend Development Internship</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#F6F4EE] mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#C76546] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#C76546] transition-colors">
                  Public Gallery
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-[#C76546] transition-colors">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#C76546] transition-colors">
                  About Project
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#F6F4EE] mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/gallery"
                    onClick={() => setActiveCategory(cat.slug || cat.name)}
                    className="hover:text-[#C76546] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Access */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#F6F4EE] mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-[#C76546] transition-colors">
                  Member Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#C76546] transition-colors">
                  Create Member Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#C76546] transition-colors">
                  Member Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#C76546] transition-colors">
                  Curator Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#74746C]">
          <p>© {currentYear} Pixora Gallery. Built with React, TypeScript &amp; Tailwind CSS.</p>
          <p className="flex items-center gap-1">
            Curated photography with open licensing via Unsplash
          </p>
        </div>
      </div>
    </footer>
  );
};
