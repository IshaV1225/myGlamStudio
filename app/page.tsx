'use client';

/**
 * app/page.tsx — The "/" route. A pure redirect — renders nothing visible.
 *
 * WHY NOT JUST USE A REDIRECT IN next.config?
 * Because the destination depends on runtime state (has the user onboarded?).
 * A static config redirect can't read React context. This component can.
 *
 * HOW IT WORKS:
 * 1. UserContext loads the profile (from localStorage or defaults)
 * 2. useEffect runs after render, reads hasOnboarded
 * 3. router.replace() navigates without adding a history entry
 *    (replace vs push: the user can't press Back to get to "/" again)
 *
 * hasOnboarded is set to true at the end of the onboarding quiz.
 * New users (hasOnboarded = false) → /onboarding
 * Returning users (hasOnboarded = true) → /home
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function RootPage() {
  const router = useRouter();
  const { profile, profileLoading } = useUser();

  useEffect(() => {
    // Wait until the profile DB fetch is complete before redirecting.
    // Without this guard, a returning user would land on /onboarding because
    // hasOnboarded defaults to false before the Supabase response arrives.
    if (profileLoading) return;

    if (profile.hasOnboarded) {
      router.replace('/home');
    } else {
      router.replace('/onboarding');
    }
  }, [profile.hasOnboarded, profileLoading, router]);

  return null;
}
