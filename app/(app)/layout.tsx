'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { LooksProvider } from '@/contexts/LooksContext';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { MoodBoardProvider } from '@/contexts/MoodBoardContext';
import { useAuth } from '@/contexts/AuthContext';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  // Don't render app content until we know auth state
  if (loading || !session) return null;

  return <>{children}</>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LooksProvider>
      <ProductsProvider>
        <MoodBoardProvider>
          <AuthGuard>
            <NavBar />
            {children}
          </AuthGuard>
        </MoodBoardProvider>
      </ProductsProvider>
    </LooksProvider>
  );
}
