'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Look {
  id: string;
  name: string;
  gradients: string[];   // one entry per image; first is the gallery cover
  heightClass: string;
  isTopFive: boolean;
  steps: string[];
  productsUsed: string[];
  moodBoards: string[];
}

// ---------------------------------------------------------------------------
// Palette helpers
// ---------------------------------------------------------------------------

const PALETTE = [
  'linear-gradient(135deg, #4B3B8C, #7B3F6E)',
  'linear-gradient(135deg, #7B3F6E, #F4796B)',
  'linear-gradient(135deg, #F4796B, #4B3B8C)',
  'linear-gradient(135deg, #0F0A1E, #4B3B8C)',
  'linear-gradient(135deg, #F9B4A8, #F4796B)',
  'linear-gradient(135deg, #4B3B8C, #F9B4A8)',
  'linear-gradient(135deg, #1C1333, #7B3F6E)',
  'linear-gradient(135deg, #9B8DB0, #1C1333)',
];

export function makeGradients(count: number): string[] {
  return Array.from({ length: Math.max(1, count) }, (_, i) => PALETTE[i % PALETTE.length]);
}

// ---------------------------------------------------------------------------
// Initial mock data
// ---------------------------------------------------------------------------

const INITIAL_LOOKS: Look[] = [
  {
    id: '1', name: 'Evening Glam', isTopFive: true, heightClass: 'h-80', moodBoards: ['Evening Edit'],
    gradients: [
      'linear-gradient(135deg, #4B3B8C, #7B3F6E)',
      'linear-gradient(135deg, #7B3F6E, #F4796B)',
      'linear-gradient(135deg, #F4796B, #4B3B8C)',
    ],
    steps: ['Prep skin with primer', 'Apply full-coverage foundation', 'Contour cheekbones', 'Smoky cut-crease eye', 'Highlight inner corners', 'Bold lip'],
    productsUsed: ["Pro Filt'r Foundation — Fenty Beauty", 'Lip Liner — Charlotte Tilbury'],
  },
  {
    id: '2', name: 'Smoky Eye', isTopFive: true, heightClass: 'h-64', moodBoards: ['Smoky'],
    gradients: ['linear-gradient(135deg, #0F0A1E, #4B3B8C)', 'linear-gradient(135deg, #4B3B8C, #1C1333)'],
    steps: ['Dark base on lid', 'Blend outer V', 'Lower lash line smoke', 'Volumising mascara'],
    productsUsed: ['Mascara — Lancôme'],
  },
  {
    id: '3', name: 'Natural Flush', isTopFive: true, heightClass: 'h-72', moodBoards: ['Clean Girl'],
    gradients: ['linear-gradient(135deg, #F9B4A8, #F4796B)', 'linear-gradient(135deg, #F4796B, #7B3F6E)'],
    steps: ['Tinted moisturiser', 'Cream blush on cheeks', 'Gloss on lips', 'Mascara'],
    productsUsed: ['Blush Stick — Rare Beauty', 'Mascara — Lancôme'],
  },
  {
    id: '4', name: 'Sunset Drama', isTopFive: true, heightClass: 'h-56', moodBoards: [],
    gradients: ['linear-gradient(135deg, #7B3F6E, #F4796B)', 'linear-gradient(135deg, #F4796B, #F9B4A8)'],
    steps: ['Orange cut-crease', 'Pink transition shade', 'Gold inner corner', 'Nude lip'],
    productsUsed: ['Lip Liner — Charlotte Tilbury'],
  },
  {
    id: '5', name: 'Clean Girl', isTopFive: true, heightClass: 'h-80', moodBoards: ['Clean Girl', 'Icy'],
    gradients: ['linear-gradient(135deg, #9B8DB0, #1C1333)', 'linear-gradient(135deg, #1C1333, #4B3B8C)'],
    steps: ['SPF moisturiser', 'Concealer where needed', 'Brow gel', 'Mascara', 'Gloss'],
    productsUsed: ['Brow Pencil — Anastasia BH', 'Mascara — Lancôme'],
  },
  {
    id: '6', name: 'Bridal Glow', isTopFive: false, heightClass: 'h-72', moodBoards: [],
    gradients: ['linear-gradient(135deg, #F9B4A8, #7B3F6E)'],
    steps: ['Hydrating prep', 'Satin foundation', 'Rosy blush', 'Soft shimmer eye', 'Nude-pink lip'],
    productsUsed: ["Pro Filt'r Foundation — Fenty Beauty", 'Blush Stick — Rare Beauty'],
  },
  {
    id: '7', name: 'Editorial Edge', isTopFive: false, heightClass: 'h-96', moodBoards: [],
    gradients: ['linear-gradient(135deg, #4B3B8C, #F4796B)', 'linear-gradient(135deg, #F4796B, #7B3F6E)'],
    steps: ['Bold graphic liner', 'Monochromatic lip + eye', 'Negative space detail'],
    productsUsed: ['Lip Liner — Charlotte Tilbury'],
  },
  {
    id: '8', name: 'Office Chic', isTopFive: false, heightClass: 'h-60', moodBoards: [],
    gradients: ['linear-gradient(135deg, #1C1333, #9B8DB0)'],
    steps: ['Skin prep', 'Light coverage BB cream', 'Defined brows', 'Mascara', 'Satin lip'],
    productsUsed: ['Brow Pencil — Anastasia BH'],
  },
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface LooksCtx {
  looks: Look[];
  addLook: (look: Look) => void;
  updateLook: (updated: Look) => void;
  removeLook: (id: string) => void;
}

const LooksContext = createContext<LooksCtx | null>(null);

export function LooksProvider({ children }: { children: ReactNode }) {
  const [looks, setLooks] = useState<Look[]>(INITIAL_LOOKS);

  function addLook(look: Look) {
    setLooks((prev) => [look, ...prev]);
  }

  function updateLook(updated: Look) {
    setLooks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }

  function removeLook(id: string) {
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
