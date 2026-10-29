import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lightbox } from '../components/Lightbox';
import { ToastContainer } from '../components/Toast';
import { 
  Camera, 
  LayoutDashboard, 
  Compass, 
  Heart, 
  UserCheck, 
  LogOut, 
  ArrowLeft 
} from 'lucide-react';

export const MemberLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#EDE9E1] text-[#242522] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#DDD8CE] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#DDD8CE]">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C76546] text-white flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#242522]">
                  Pixora
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-[#687453]">
                  Member Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Member Navigation">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/dashboard')
                  ? 'bg-[#E7EBDD] text-[#46523A] border border-[#687453]/20'
                  : 'text-[#74746C] hover:text-[#242522] hover:bg-[#F7F5F0]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#687453]" />
              <span>Overview</span>
            </Link>

            <Link
              to="/gallery"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#74746C] hover:text-[#242522] hover:bg-[#F7F5F0] transition"
            >
              <Compass className="w-4 h-4 text-[#C76546]" />
              <span>Explore Gallery</span>
            </Link>

            <Link
              to="/dashboard/favorites"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/dashboard/favorites')
                  ? 'bg-[#E7EBDD] text-[#46523A] border border-[#687453]/20'
                  : 'text-[#74746C] hover:text-[#242522] hover:bg-[#F7F5F0]'
              }`}
            >
              <Heart className="w-4 h-4 text-[#C76546]" />
              <span>My Favorites</span>
            </Link>

            <Link
              to="/dashboard/profile"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/dashboard/profile')
                  ? 'bg-[#E7EBDD] text-[#46523A] border border-[#687453]/20'
                  : 'text-[#74746C] hover:text-[#242522] hover:bg-[#F7F5F0]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#687453]" />
              <span>Profile Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#DDD8CE] bg-[#F7F5F0]/60">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="w-10 h-10 rounded-full object-cover border border-[#DDD8CE]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#C76546] text-white flex items-center justify-center font-bold text-sm">
                {user?.display_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#242522] truncate">{user?.display_name}</p>
              <p className="text-xs text-[#74746C] truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#B42318] hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white/80 backdrop-blur-xs border-b border-[#DDD8CE] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-[#74746C] hover:text-[#242522] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Site</span>
            </Link>
          </div>
          <div className="text-xs text-[#687453] font-semibold bg-[#E7EBDD] px-3 py-1 rounded-full">
            Active Member Session
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <Lightbox />
      <ToastContainer />
    </div>
  );
};
