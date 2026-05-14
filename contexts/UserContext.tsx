'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// ---------------------------------------------------------------------------
// Type
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

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  skinType: '',
  skinTone: '',
  complexion: '',
  undertone: '',
  location: '',
  preferredBrands: [],
  preferredLooks: [],
  heroGradient: 'linear-gradient(135deg, #CDB4DB 0%, #FFAFCC 30%, #FFC8DD 60%, #BDE0FE 80%, #A2D2FF 100%)',
  hasOnboarded: false,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface UserCtx {
  profile: UserProfile;
  profileLoading: boolean; // true while the initial DB fetch is in flight
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserCtx | null>(null);

// ---------------------------------------------------------------------------
// DB row → TypeScript type
// ---------------------------------------------------------------------------

function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    name:            (row.name            as string)   ?? '',
    email:           (row.email           as string)   ?? '',
    skinType:        (row.skin_type       as string)   ?? '',
    skinTone:        (row.skin_tone       as string)   ?? '',
    complexion:      (row.complexion      as string)   ?? '',
    undertone:       (row.undertone       as string)   ?? '',
    location:        (row.location        as string)   ?? '',
    preferredBrands: (row.preferred_brands as string[]) ?? [],
    preferredLooks:  (row.preferred_looks  as string[]) ?? [],
    heroGradient:    (row.hero_gradient   as string)   || DEFAULT_PROFILE.heroGradient,
    hasOnboarded:    (row.has_onboarded   as boolean)  ?? false,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function UserProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const [profile, setProfile]           = useState<UserProfile>(DEFAULT_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load profile from Supabase whenever the session changes.
  // We wait for auth to finish loading before acting — otherwise the first
  // effect run sees session=null (auth not yet resolved) and sets profileLoading=false
  // prematurely, causing app/page.tsx to route to /onboarding before the real
  // session and profile have loaded.
  useEffect(() => {
    async function load() {
      if (authLoading) return;
      if (!session) {
        setProfile(DEFAULT_PROFILE);
        setProfileLoading(false);
        return;
      }
      setProfileLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        // Returning user — profile row exists, load it normally
        setProfile(rowToProfile(data));
      } else {
        // First login (e.g. via Google OAuth) — no profile row yet.
        // Supabase stores the Google account's name and email in user_metadata.
        // Pre-fill from there so the NavBar title isn't blank before onboarding.
        const meta = session.user.user_metadata ?? {};
        setProfile({
          ...DEFAULT_PROFILE,
          name:  (meta.full_name as string) || (meta.name as string) || '',
          email: session.user.email ?? '',
        });
      }
      setProfileLoading(false);
    }
    load();
  }, [session, authLoading]);

  // Optimistic update: apply patch to local state immediately, then upsert to DB.
  // Using the function form of setState ensures we always merge against the
  // latest value, even if this is called multiple times before a re-render.
  async function updateProfile(patch: Partial<UserProfile>) {
    let merged!: UserProfile;
    setProfile((prev) => {
      merged = { ...prev, ...patch };
      return merged;
    });

    if (!session) return;

    await supabase.from('profiles').upsert({
      id:               session.user.id,
      name:             merged.name,
      email:            merged.email,
      skin_type:        merged.skinType,
      skin_tone:        merged.skinTone,
      complexion:       merged.complexion,
      undertone:        merged.undertone,
      location:         merged.location,
      preferred_brands: merged.preferredBrands,
      preferred_looks:  merged.preferredLooks,
      hero_gradient:    merged.heroGradient,
      has_onboarded:    merged.hasOnboarded,
      updated_at:       new Date().toISOString(),
    });
  }

  return (
    <UserContext.Provider value={{ profile, profileLoading, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
