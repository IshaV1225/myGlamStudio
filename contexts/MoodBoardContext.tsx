'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MoodBoard {
  id: string;
  name: string;
  gradients: string[];   // placeholder until real images
  aiDescription?: string;
  pinterestBoardUrl?: string;
}

// ---------------------------------------------------------------------------
// Palette helper
// ---------------------------------------------------------------------------

const PALETTE = [
  'linear-gradient(135deg, #4B3B8C, #7B3F6E)',
  'linear-gradient(135deg, #F4796B, #F9B4A8)',
  'linear-gradient(135deg, #0F0A1E, #4B3B8C)',
  'linear-gradient(135deg, #7B3F6E, #F4796B)',
  'linear-gradient(135deg, #1C1333, #9B8DB0)',
  'linear-gradient(135deg, #F9B4A8, #4B3B8C)',
  'linear-gradient(135deg, #9B8DB0, #7B3F6E)',
  'linear-gradient(135deg, #4B3B8C, #F4796B)',
];

export function makeGradients(count: number): string[] {
  return Array.from({ length: Math.max(1, count) }, (_, i) => PALETTE[i % PALETTE.length]);
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const INITIAL_BOARDS: MoodBoard[] = [
  {
    id: 'mb1', name: 'Evening Edit',
    gradients: [PALETTE[0], PALETTE[3], PALETTE[7], PALETTE[1]],
    aiDescription: 'A deep, sultry palette of indigos and plums — perfect for dramatic evening looks with smoky eyes and bold lips.',
  },
  {
    id: 'mb2', name: 'Clean Girl',
    gradients: [PALETTE[4], PALETTE[5], PALETTE[2]],
    aiDescription: 'Soft, effortless aesthetics with muted lavenders and blush tones. Minimal makeup, maximum glow.',
  },
  {
    id: 'mb3', name: 'Smoky',
    gradients: [PALETTE[2], PALETTE[0], PALETTE[6]],
  },
  {
    id: 'mb4', name: 'Icy',
    gradients: [PALETTE[4], PALETTE[6], PALETTE[5], PALETTE[1], PALETTE[3]],
    aiDescription: 'Cool, silvery tones reminiscent of frost and crystal. Ideal for icy highlight looks and glass-skin finishes.',
  },
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface MoodBoardCtx {
  boards: MoodBoard[];
  addBoard: (b: MoodBoard) => void;
  updateBoard: (b: MoodBoard) => void;
  removeBoard: (id: string) => void;
}

const MoodBoardContext = createContext<MoodBoardCtx | null>(null);

export function MoodBoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<MoodBoard[]>(INITIAL_BOARDS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gs_moodboards');
      if (raw) setBoards(JSON.parse(raw) as MoodBoard[]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('gs_moodboards', JSON.stringify(boards));
  }, [boards]);

  function addBoard(b: MoodBoard)    { setBoards((prev) => [b, ...prev]); }
  function updateBoard(b: MoodBoard) { setBoards((prev) => prev.map((x) => x.id === b.id ? b : x)); }
  function removeBoard(id: string)   { setBoards((prev) => prev.filter((b) => b.id !== id)); }

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
