'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

export interface MoodBoard {
  id: string;
  name: string;
  imageUrls: string[];           // CSS gradients now; real image URLs after step 2
  aiDescription?: string;
  pinterestBoardUrl?: string;
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
  'linear-gradient(135deg, #FFC8DD, #FFAFCC)',
  'linear-gradient(135deg, #CDB4DB, #BDE0FE)',
  'linear-gradient(135deg, #FFAFCC, #A2D2FF)',
];

export function makeGradients(count: number): string[] {
  return Array.from({ length: Math.max(1, count) }, (_, i) => PALETTE[i % PALETTE.length]);
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface MoodBoardCtx {
  boards: MoodBoard[];
  addBoard:    (b: Omit<MoodBoard, 'id'>) => Promise<void>;
  updateBoard: (b: MoodBoard)             => Promise<void>;
  removeBoard: (id: string)               => Promise<void>;
}

const MoodBoardContext = createContext<MoodBoardCtx | null>(null);

// ---------------------------------------------------------------------------
// DB ↔ TypeScript mapper
// ---------------------------------------------------------------------------

function rowToBoard(row: Record<string, unknown>): MoodBoard {
  return {
    id:                 row.id                   as string,
    name:               row.name                 as string,
    imageUrls:          (row.image_urls          as string[]) ?? [],
    aiDescription:      (row.ai_description      as string)  || undefined,
    pinterestBoardUrl:  (row.pinterest_board_url as string)  || undefined,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function MoodBoardProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [boards, setBoards] = useState<MoodBoard[]>([]);
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;

    supabase
      .from('moodboards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setBoards(data.map(rowToBoard));
      });
  }, [userId]);

  async function addBoard(b: Omit<MoodBoard, 'id'>) {
    if (!userId) return;
    const { data } = await supabase
      .from('moodboards')
      .insert({
        user_id:             userId,
        name:                b.name,
        image_urls:          b.imageUrls,
        ai_description:      b.aiDescription      ?? null,
        pinterest_board_url: b.pinterestBoardUrl  ?? null,
      })
      .select()
      .single();
    if (data) setBoards((prev) => [rowToBoard(data), ...prev]);
  }

  async function updateBoard(b: MoodBoard) {
    if (!userId) return;
    await supabase
      .from('moodboards')
      .update({
        name:                b.name,
        image_urls:          b.imageUrls,
        ai_description:      b.aiDescription      ?? null,
        pinterest_board_url: b.pinterestBoardUrl  ?? null,
      })
      .eq('id', b.id);
    setBoards((prev) => prev.map((x) => x.id === b.id ? b : x));
  }

  async function removeBoard(id: string) {
    if (!userId) return;
    await supabase.from('moodboards').delete().eq('id', id);
    setBoards((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <MoodBoardContext.Provider value={{ boards, addBoard, updateBoard, removeBoard }}>
      {children}
    </MoodBoardContext.Provider>
  );
}

export function useMoodBoards() {
  const ctx = useContext(MoodBoardContext);
  if (!ctx) throw new Error('useMoodBoards must be used inside MoodBoardProvider');
  return ctx;
}
