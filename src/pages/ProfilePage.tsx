import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { User, Mail, Shield, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useGallery();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      addToast('Display name cannot be empty.', 'error');
      return;
    }

    setIsSaving(true);
    setSuccessNotice(false);

    try {
      await updateProfile({
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim() || undefined,
      });
      setSuccessNotice(true);
      addToast('Profile updated successfully!', 'success');
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err: any) {
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#242522]">Profile Settings</h1>
        <p className="text-sm text-[#74746C] mt-1.5">
          Manage your personal details and public presentation.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DDD8CE] shadow-xs">
        {successNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#287A52] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Your profile settings were saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-5 pb-6 border-b border-[#DDD8CE]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#C76546]"
                onError={() => addToast('Avatar URL failed to load. Please verify the URL.', 'warning')}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#C76546] text-white flex items-center justify-center font-bold text-2xl">
                {displayName.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm text-[#242522]">{displayName || 'User Profile'}</h3>
              <p className="text-xs text-[#74746C] mt-0.5">{user?.email}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E7EBDD] text-[#46523A] text-[10px] font-bold uppercase tracking-wider mt-1.5">
                Role: {user?.role}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1.5">
              Full Display Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1.5">
              Email Address (Fixed Account ID)
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-11 pr-4 py-2.5 bg-[#EDE9E1]/50 border border-[#DDD8CE] rounded-xl text-sm text-[#74746C] cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-[#74746C] mt-1">
              Your registered email cannot be modified from client settings for security.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1.5">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74746C]" />
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#F7F5F0] border border-[#DDD8CE] rounded-xl text-sm text-[#242522] focus:outline-none focus:border-[#C76546]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#C76546] hover:bg-[#A94E34] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
