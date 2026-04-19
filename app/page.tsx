'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function RootPage() {
  const router = useRouter();
  const { profile } = useUser();

  useEffect(() => {
    // First-time users (no name set yet) go to onboarding; returning users go home
    if (profile.hasOnboarded) {
      router.replace('/home');
    } else {
      router.replace('/onboarding');
    }
  }, [profile.hasOnboarded, router]);

  return null;
}
