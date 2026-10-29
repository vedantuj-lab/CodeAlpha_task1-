import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Lightbox } from '../components/Lightbox';
import { ToastContainer } from '../components/Toast';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#242522]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Lightbox />
      <ToastContainer />
    </div>
  );
};
