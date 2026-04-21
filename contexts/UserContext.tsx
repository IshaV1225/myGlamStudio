'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  name: string;
  email: string;
  skinType: string;
  skinTone: string;
  complexion: string;
  undertone: string;
  location: string;
  preferredBrands: string[];
  preferredLooks: string[];
  heroGradient: string;
  hasOnboarded: boolean;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_PROFILE: UserProfile = {
  name: 'Isha',
  email: 'isha@example.com',
  skinType: 'Combination',
  skinTone: 'Medium',
  complexion: 'Medium',
  undertone: 'Warm',
  location: 'UAE',
  preferredBrands: ['Fenty Beauty', 'Charlotte Tilbury', 'Rare Beauty'],
  preferredLooks: ['Full Glam', 'Natural'],
  heroGradient: 'linear-gradient(135deg, #CDB4DB 0%, #FFAFCC 30%, #FFC8DD 60%, #BDE0FE 80%, #A2D2FF 100%)',
  hasOnboarded: false,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface UserCtx {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gs_profile');
      if (raw) {
        const stored = JSON.parse(raw) as UserProfile;
        // Reset hero gradient if it contains old dark-theme colors
        const isDarkGradient = /4B3B8C|7B3F6E|0F0A1E|1C1333|F4796B|F9B4A8/.test(stored.heroGradient ?? '');
        if (isDarkGradient) stored.heroGradient = DEFAULT_PROFILE.heroGradient;
        setProfile(stored);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('gs_profile', JSON.stringify(profile));
  }, [profile]);

  function updateProfile(patch: Partial<UserProfile>) {
    setProfile((prev) => ({ ...prev, ...patch }));
  }

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
