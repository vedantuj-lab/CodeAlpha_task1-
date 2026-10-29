import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lightbox } from '../components/Lightbox';
import { ToastContainer } from '../components/Toast';
import { 
  Camera, 
  BarChart3, 
  Image as ImageIcon, 
  FolderTree, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  AlertOctagon 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Role Protection check
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1E201E] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#292C29] p-8 rounded-3xl border border-[#41443F] text-center">
          <div className="w-14 h-14 rounded-full bg-rose-950/60 text-[#B42318] flex items-center justify-center mx-auto mb-4">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Administrator Access Required</h2>
          <p className="text-sm text-[#B7B9B0] mb-6 leading-relaxed">
            You must be signed in with an authorized Administrator account to view curator controls.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full py-2.5 bg-[#C76546] hover:bg-[#A94E34] text-white text-sm font-semibold rounded-full transition"
            >
              Sign In as Administrator
            </Link>
            <Link
              to="/"
              className="w-full py-2.5 text-sm font-semibold text-[#B7B9B0] hover:text-white transition"
            >
              Return to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#242522] flex flex-col md:flex-row">
      {/* Deep Charcoal Sidebar */}
      <aside className="w-full md:w-64 bg-[#1E201E] text-[#B7B9B0] border-r border-[#41443F] flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#41443F]">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C76546] text-white flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#F6F4EE]">
                  Pixora
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-[#C7A56B]">
                  Admin Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5" aria-label="Administrator Navigation">
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/admin')
                  ? 'bg-[#292C29] text-[#F6F4EE] border border-[#C7A56B]/30'
                  : 'text-[#B7B9B0] hover:text-[#F6F4EE] hover:bg-[#292C29]/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#C7A56B]" />
              <span>Overview &amp; Stats</span>
            </Link>

            <Link
              to="/admin/images"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/admin/images')
                  ? 'bg-[#292C29] text-[#F6F4EE] border border-[#C7A56B]/30'
                  : 'text-[#B7B9B0] hover:text-[#F6F4EE] hover:bg-[#292C29]/60'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#C76546]" />
              <span>Manage Photographs</span>
            </Link>

            <Link
              to="/admin/categories"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/admin/categories')
                  ? 'bg-[#292C29] text-[#F6F4EE] border border-[#C7A56B]/30'
                  : 'text-[#B7B9B0] hover:text-[#F6F4EE] hover:bg-[#292C29]/60'
              }`}
            >
              <FolderTree className="w-4 h-4 text-[#687453]" />
              <span>Manage Categories</span>
            </Link>
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-[#41443F] bg-[#171817]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#C7A56B] text-[#1E201E] flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#F6F4EE] truncate">{user.display_name}</p>
              <span className="text-[10px] text-[#C7A56B] uppercase font-bold tracking-wider">
                Administrator
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#DDD8CE] px-6 flex items-center justify-between shrink-0">
          <Link
            to="/"
            className="text-xs font-semibold text-[#74746C] hover:text-[#242522] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Gallery</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#287A52] bg-[#E7EBDD] px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#287A52] animate-pulse"></span>
            <span>Administrator Authorized</span>
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
