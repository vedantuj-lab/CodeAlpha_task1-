import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { Camera, Lock, Mail, User, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { addToast } = useGallery();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await register(displayName, email, password);
      addToast(`Account created! Welcome to Pixora, ${newUser.display_name}.`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E201E] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80"
          alt="Atmospheric misty forest"
          className="w-full h-full object-cover filter blur-xs"
        />
      </div>

      <div className="relative max-w-5xl w-full bg-[#F7F5F0] rounded-3xl overflow-hidden shadow-2xl border border-[#41443F]/40 grid grid-cols-1 lg:grid-cols-12 z-10">
        {/* Left Branding Panel */}
        <div className="lg:col-span-5 bg-[#171817] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80"
              alt="Majestic lion portrait"
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

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#687453]">
              Join Community
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F6F4EE] mt-2 mb-4 leading-tight">
              Begin Your Visual Journey.
            </h2>
            <p className="text-sm text-[#B7B9B0] leading-relaxed">
              Register as a member to curate personalized collections, save favorite photographs, and follow updates across our curated galleries.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-[#41443F]/60 mt-8 space-y-2 text-xs text-[#B7B9B0]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C7A56B]" />
              <span>Full-resolution viewing experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C7A56B]" />
              <span>Persistent cloud &amp; local favorites</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C7A56B]" />
              <span>100% Free &amp; Open Creative Licensing</span>
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h1 className="font-serif text-3xl font-bold text-[#242522]">Create Account</h1>
              <p className="text-sm text-[#74746C] mt-1.5">
                Join our community of photography enthusiasts.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-[#B42318] leading-relaxed"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                  Full Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546] focus:ring-2 focus:ring-[#F4E0D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
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
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546] focus:ring-2 focus:ring-[#F4E0D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546] focus:ring-2 focus:ring-[#F4E0D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546] focus:ring-2 focus:ring-[#F4E0D7]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#C76546] hover:bg-[#A94E34] text-white font-bold text-sm rounded-full transition shadow-md disabled:opacity-50 mt-3"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#74746C]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#C76546] hover:underline">
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
