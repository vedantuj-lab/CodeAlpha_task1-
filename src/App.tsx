import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GalleryProvider } from './context/GalleryContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { MemberLayout } from './layouts/MemberLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { GalleryPage } from './pages/GalleryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageImagesPage } from './pages/ManageImagesPage';
import { ManageCategoriesPage } from './pages/ManageCategoriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GalleryProvider>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Member Dashboard Routes */}
            <Route path="/dashboard" element={<MemberLayout />}>
              <Route index element={<MemberDashboard />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="images" element={<ManageImagesPage />} />
              <Route path="categories" element={<ManageCategoriesPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GalleryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
