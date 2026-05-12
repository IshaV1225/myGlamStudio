'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

export interface Look {
  id: string;
  name: string;
  imageUrls: string[];   // CSS gradients now; real image URLs after step 2 (uploads)
  heightClass: string;   // Tailwind class (h-56, h-72 etc.) for masonry grid variety
  isTopFive: boolean;
  steps: string[];
  productsUsed: string[];
  moodBoards: string[];
}

// ---------------------------------------------------------------------------
// Gradient palette — placeholder images until real uploads are wired (step 2)
// ---------------------------------------------------------------------------

const PALETTE = [
  'linear-gradient(135deg, #CDB4DB, #FFAFCC)',
  'linear-gradient(135deg, #FFAFCC, #FFC8DD)',
  'linear-gradient(135deg, #FFC8DD, #BDE0FE)',
  'linear-gradient(135deg, #BDE0FE, #A2D2FF)',
  'linear-gradient(135deg, #A2D2FF, #CDB4DB)',
  'linear-gradient(135deg, #CDB4DB, #BDE0FE)',
  'linear-gradient(135deg, #FFAFCC, #A2D2FF)',
  'linear-gradient(135deg, #FFC8DD, #CDB4DB)',
];

export function makeGradients(count: number): string[] {
  return Array.from({ length: Math.max(1, count) }, (_, i) => PALETTE[i % PALETTE.length]);
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface LooksCtx {
  looks: Look[];
  addLook:    (look: Omit<Look, 'id'>) => Promise<void>;
  updateLook: (updated: Look)          => Promise<void>;
  removeLook: (id: string)             => Promise<void>;
}

const LooksContext = createContext<LooksCtx | null>(null);

// ---------------------------------------------------------------------------
// DB ↔ TypeScript mappers
// ---------------------------------------------------------------------------

function rowToLook(row: Record<string, unknown>): Look {
  return {
    id:           row.id          as string,
    name:         row.name        as string,
    imageUrls:    (row.image_urls    as string[]) ?? [],
    heightClass:  (row.height_class  as string)   ?? 'h-72',
    isTopFive:    (row.is_top_five   as boolean)  ?? false,
    steps:        (row.steps         as string[]) ?? [],
    productsUsed: (row.products_used as string[]) ?? [],
    moodBoards:   (row.mood_boards   as string[]) ?? [],
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function LooksProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [looks, setLooks] = useState<Look[]>([]);
  const userId = session?.user.id;

  // Fetch this user's looks whenever the logged-in user changes.
  // No synchronous setState — initial state is already [].
  // Providers unmount on logout (AuthGuard), so stale data is never shown.
  useEffect(() => {
    if (!userId) return;

    supabase
      .from('looks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setLooks(data.map(rowToLook));
      });
  }, [userId]);

  async function addLook(look: Omit<Look, 'id'>) {
    if (!userId) return;
    const { data } = await supabase
      .from('looks')
      .insert({
        user_id:      userId,
        name:         look.name,
        image_urls:   look.imageUrls,
        height_class: look.heightClass,
        is_top_five:  look.isTopFive,
        steps:        look.steps,
        products_used: look.productsUsed,
        mood_boards:  look.moodBoards,
      })
      .select()
      .single();
    if (data) setLooks((prev) => [rowToLook(data), ...prev]);
  }

  async function updateLook(updated: Look) {
    if (!userId) return;
    await supabase
      .from('looks')
      .update({
        name:         updated.name,
        image_urls:   updated.imageUrls,
        height_class: updated.heightClass,
        is_top_five:  updated.isTopFive,
        steps:        updated.steps,
        products_used: updated.productsUsed,
        mood_boards:  updated.moodBoards,
        updated_at:   new Date().toISOString(),
      })
      .eq('id', updated.id);
    setLooks((prev) => prev.map((l) => l.id === updated.id ? updated : l));
  }

  async function removeLook(id: string) {
    if (!userId) return;
    await supabase.from('looks').delete().eq('id', id);
    setLooks((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <LooksContext.Provider value={{ looks, addLook, updateLook, removeLook }}>
      {children}
    </LooksContext.Provider>
  );
}

export function useLooks() {
  const ctx = useContext(LooksContext);
  if (!ctx) throw new Error('useLooks must be used inside LooksProvider');
  return ctx;
}
