import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { Camera, Eye, EyeOff, Lock, Mail, ArrowRight, Shield, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, resetPassword } = useAuth();
  const { addToast } = useGallery();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.display_name}!`, 'success');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const msg = await resetPassword(resetEmail);
      addToast(msg, 'info');
      setShowForgotModal(false);
      setResetEmail('');
    } catch (err: any) {
      addToast(err.message || 'Password reset request failed.', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E201E] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Background Photography Texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt="Atmospheric background"
          className="w-full h-full object-cover filter blur-xs"
        />
      </div>

      <div className="relative max-w-5xl w-full bg-[#F7F5F0] rounded-3xl overflow-hidden shadow-2xl border border-[#41443F]/40 grid grid-cols-1 lg:grid-cols-12 z-10">
        {/* Left Editorial Branding Panel */}
        <div className="lg:col-span-5 bg-[#171817] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
              alt="Architectural lines"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-[#C76546] text-white flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Pixora
              </span>
            </Link>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C7A56B]">
              Member Portal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F6F4EE] mt-2 mb-4 leading-tight">
              A World of Perspectives.
            </h2>
            <p className="text-sm text-[#B7B9B0] leading-relaxed">
              Discover, collect, and revisit the extraordinary photographs that inspire you.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-[#41443F]/60 mt-8 text-xs text-[#B7B9B0]/80">
            <p className="font-medium">"Every image tells a story."</p>
            <p className="text-[#C7A56B] mt-1">CodeAlpha Internship Showcase Project</p>
          </div>
        </div>

        {/* Right Authentication Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-[#242522]">Welcome Back</h1>
              <p className="text-sm text-[#74746C] mt-1.5">
                Sign in to manage your favorites and access your portfolio.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-[#B42318] leading-relaxed"
              >
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546] focus:ring-2 focus:ring-[#F4E0D7]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#242522]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-[#C76546] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-white border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546] focus:ring-2 focus:ring-[#F4E0D7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#74746C] hover:text-[#242522]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#C76546] hover:bg-[#A94E34] text-white font-bold text-sm rounded-full transition shadow-md disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Logins Helper */}
            <div className="mt-8 pt-6 border-t border-[#DDD8CE]">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#74746C] mb-3 text-center">
                One-Click Demo Credentials
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoFill('member@pixora.gallery', 'member123')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-[#DDD8CE] hover:border-[#687453] hover:bg-[#E7EBDD]/40 text-xs font-bold text-[#46523A] transition"
                >
                  <User className="w-3.5 h-3.5 text-[#687453]" />
                  <span>Demo Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@pixora.gallery', 'admin123')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-[#DDD8CE] hover:border-[#C7A56B] hover:bg-[#1E201E] hover:text-white text-xs font-bold text-[#242522] transition"
                >
                  <Shield className="w-3.5 h-3.5 text-[#C7A56B]" />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>

            {/* Footer link to Register */}
            <div className="mt-8 text-center text-xs text-[#74746C]">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#C76546] hover:underline">
                Create Member Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#DDD8CE] relative">
            <h3 className="font-serif text-2xl font-bold text-[#242522] mb-2">Password Recovery</h3>
            <p className="text-xs text-[#74746C] leading-relaxed mb-4">
              Enter your registered email address to receive password recovery instructions.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-sm focus:outline-none focus:border-[#C76546]"
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#74746C] hover:text-[#242522]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold rounded-full transition"
                >
                  {resetLoading ? 'Sending...' : 'Send Recovery Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
