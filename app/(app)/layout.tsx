'use client';

/**
 * app/(app)/layout.tsx — Layout for all protected app pages.
 *
 * TWO JOBS:
 * 1. Mounts the NavBar above every app page
 * 2. Blocks unauthenticated access via AuthGuard
 *
 * WHY 'use client'?
 * The AuthGuard needs to use hooks (useAuth, useRouter, useEffect) which only
 * work in client components. Next.js layout files are server components by
 * default, so we mark this file client-side to enable hooks.
 *
 * THE AUTH GUARD PATTERN:
 * AuthGuard reads the session from AuthContext. While Supabase is still
 * checking the stored token (loading = true), it renders nothing — this
 * prevents a brief flash of the app content before the redirect fires.
 * Once loading is false:
 *   - session exists → render the app normally
 *   - session is null → redirect to /login
 *
 * PROVIDER NESTING:
 * Data providers (LooksProvider etc.) wrap AuthGuard, not the other way around.
 * This means the providers are always mounted, which is fine — they just hold
 * empty/default state until a real user loads data into them.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { LooksProvider } from '@/contexts/LooksContext';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { MoodBoardProvider } from '@/contexts/MoodBoardContext';
import { useAuth } from '@/contexts/AuthContext';

// Sits between the providers and the page content.
// Redirects to /login if there's no active Supabase session.
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once we're sure there's no session (loading done, session null).
    // Without the !loading check, this would redirect on every render during init.
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  // Render nothing while checking auth or if unauthenticated.
  // This prevents the app content from flashing before the redirect.
  if (loading || !session) return null;

  return <>{children}</>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // Data providers first — they make useLooks(), useProducts(), useMoodBoards()
    // available to NavBar and every page inside this layout.
    <LooksProvider>
      <ProductsProvider>
        <MoodBoardProvider>
          {/* AuthGuard wraps NavBar + page content so both are protected */}
          <AuthGuard>
            <NavBar />
            {children}
          </AuthGuard>
        </MoodBoardProvider>
      </ProductsProvider>
    </LooksProvider>
  );
}
