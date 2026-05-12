'use client';

/**
 * contexts/AuthContext.tsx — Tracks the live Supabase auth session.
 *
 * WHAT IS A CONTEXT?
 * A Context is React's built-in global state system. You create a value at the
 * top of the tree (in a Provider), and any component below it — no matter how
 * deeply nested — can read that value with useContext(). No prop-passing needed.
 *
 * WHY A SEPARATE AUTH CONTEXT?
 * Auth state (is someone logged in?) is needed by many parts of the app:
 *   - The (app)/layout needs it to block unauthenticated access
 *   - The NavBar needs it to show "Sign out"
 *   - Future pages may show user-specific data
 * Putting it in one place means one source of truth.
 *
 * WHAT IS onAuthStateChange?
 * Supabase keeps a JWT token in a cookie/localStorage. When the app loads,
 * we need to ask "does a valid token exist?" — that's getSession().
 * Then we subscribe to any future changes (sign in, sign out, token refresh)
 * with onAuthStateChange. This means the UI reacts instantly to auth events
 * without a page reload.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Shape of the data this context provides to consumers
interface AuthCtx {
  session: Session | null; // null = not logged in, Session object = logged in
  loading: boolean;        // true during the initial auth check (prevents flash of wrong content)
}

// The context object itself — default values used only if someone calls
// useAuth() outside of an AuthProvider (which we guard against in AuthGuard)
const AuthContext = createContext<AuthCtx>({ session: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // start true: we don't know auth state yet

  useEffect(() => {
    // Step 1: Check if a session already exists (e.g. user refreshed the page).
    // Supabase stores the token in localStorage so it survives page reloads.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false); // now we know — stop showing the loading state
    });

    // Step 2: Subscribe to future auth events.
    // This fires automatically whenever: user signs in, signs out, or the
    // token is silently refreshed (Supabase does this automatically every hour).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // null on sign-out, Session object on sign-in
    });

    // Cleanup: unsubscribe when this component unmounts (e.g. full page navigation).
    // Without this, the listener would keep running and cause memory leaks.
    return () => subscription.unsubscribe();
  }, []); // empty array = run once on mount only

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — instead of writing useContext(AuthContext) everywhere,
// components just write useAuth(). Cleaner and easier to read.
export function useAuth() {
  return useContext(AuthContext);
}
