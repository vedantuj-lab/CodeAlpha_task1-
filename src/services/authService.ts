import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

const STORAGE_KEY_AUTH_USER = 'pixora_auth_user_v2';
const STORAGE_KEY_PROFILES = 'pixora_profiles_v2';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-demo-member',
    email: 'member@pixora.gallery',
    display_name: 'Elena Rostova',
    role: 'member',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'user-demo-admin',
    email: 'admin@pixora.gallery',
    display_name: 'Julian Vance (Admin)',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    created_at: '2026-01-01T00:00:00Z',
  },
];

function loadStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEMO_USERS;
  } catch {
    return DEMO_USERS;
  }
}

function saveStoredProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles to localStorage', err);
  }
}

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    }
  },

  async login(email: string, password: string): Promise<UserProfile> {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      if (data.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          display_name: profile?.display_name || email.split('@')[0],
          role: profile?.role === 'admin' ? 'admin' : 'member',
          avatar_url: profile?.avatar_url,
          created_at: profile?.created_at || new Date().toISOString(),
        };

        this.setCurrentUser(userProfile);
        return userProfile;
      }
    }

    // Local Demo Authentication Logic
    const profiles = loadStoredProfiles();
    const cleanEmail = email.trim().toLowerCase();

    // Check pre-configured demo users
    if (cleanEmail === 'admin@pixora.gallery') {
      if (password !== 'admin123') throw new Error('Invalid credentials. Hint: use password "admin123" for demo admin.');
      const adminUser = profiles.find((p) => p.email === 'admin@pixora.gallery') || DEMO_USERS[1];
      this.setCurrentUser(adminUser);
      return adminUser;
    }

    if (cleanEmail === 'member@pixora.gallery') {
      if (password !== 'member123') throw new Error('Invalid credentials. Hint: use password "member123" for demo member.');
      const memberUser = profiles.find((p) => p.email === 'member@pixora.gallery') || DEMO_USERS[0];
      this.setCurrentUser(memberUser);
      return memberUser;
    }

    // Check any user registered locally
    const existing = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
    if (!existing) {
      throw new Error('Account not found with this email. Please register or use the demo accounts provided below.');
    }

    this.setCurrentUser(existing);
    return existing;
  },

  async register(displayName: string, email: string, password: string): Promise<UserProfile> {
    if (!displayName.trim()) throw new Error('Display name is required.');
    if (!email.trim() || !email.includes('@')) throw new Error('A valid email address is required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) throw new Error(error.message);

      if (data.user) {
        // Enforce member role on registration
        const newProfile: UserProfile = {
          id: data.user.id,
          email,
          display_name: displayName,
          role: 'member',
          created_at: new Date().toISOString(),
        };
        await supabase.from('profiles').upsert(newProfile);
        this.setCurrentUser(newProfile);
        return newProfile;
      }
    }

    // Local Demo registration
    const profiles = loadStoredProfiles();
    const cleanEmail = email.trim().toLowerCase();

    if (profiles.some((p) => p.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newMember: UserProfile = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      display_name: displayName.trim(),
      role: 'member', // Strictly member role
      created_at: new Date().toISOString(),
    };

    saveStoredProfiles([...profiles, newMember]);
    this.setCurrentUser(newMember);
    return newMember;
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error', err);
      }
    }
    this.setCurrentUser(null);
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    // Prevent changing role via profile update!
    const safeUpdates = { ...updates };
    delete safeUpdates.role;
    delete safeUpdates.id;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(safeUpdates)
          .eq('id', userId)
          .select()
          .single();
        if (!error && data) {
          this.setCurrentUser(data);
          return data;
        }
      } catch (err) {
        console.error('Supabase profile update failed', err);
      }
    }

    const current = this.getCurrentUser();
    if (!current || current.id !== userId) throw new Error('Unauthorized profile modification.');

    const updated = { ...current, ...safeUpdates };
    this.setCurrentUser(updated);

    const profiles = loadStoredProfiles();
    const idx = profiles.findIndex((p) => p.id === userId);
    if (idx !== -1) {
      profiles[idx] = updated;
      saveStoredProfiles(profiles);
    }

    return updated;
  },

  async resetPassword(email: string): Promise<string> {
    if (!email) throw new Error('Please enter your email address.');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);
      return `Password recovery instructions have been sent to ${email}.`;
    }

    return `Demo Mode: Password reset simulation requested for ${email}. In production with Supabase configured, a secure recovery email is dispatched.`;
  },
};
