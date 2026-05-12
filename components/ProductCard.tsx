'use client';

/**
 * components/ProductCard.tsx — Card for a single product (home page row).
 *
 * LOCAL STATE VS CONTEXT:
 * The heart toggle uses local useState (not the ProductsContext) because
 * the home page version of the card only needs to look right — it doesn't
 * need to write back to the global products list. The products page's
 * ProductTile component does write back to context (it calls updateProduct).
 *
 * This is a deliberate trade-off: keeping this card simple and self-contained
 * makes it reusable anywhere without pulling in the whole ProductsContext.
 *
 * THE HEART COLOUR:
 * Filled heart (isFavourite = true) → #800E13 (dark red), applied via inline
 * style because Tailwind can't use arbitrary hex values in className strings
 * for dynamic values at runtime.
 * Empty heart (isFavourite = false) → text-white/60 (semi-transparent white
 * over the gradient background).
 */

import { useState } from 'react';

export interface ProductCardData {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  isFavourite: boolean;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  // Local copy of favourite state — initialised from the prop, updated on click
  const [fav, setFav] = useState(product.isFavourite);

  return (
    // Outer wrapper handles the hover scale — must be OUTSIDE overflow-hidden
    // so the scale animation isn't clipped by the rounded corners
    <div className="w-40 shrink-0 hover:scale-105 transition-transform duration-200 will-change-transform">
      <div
        className="w-full h-48 rounded-2xl relative overflow-hidden group"
        style={{ background: product.imageUrl }}
      >
        {/* Heart toggle button — positioned in the top-right corner of the card */}
        <button
          onClick={() => setFav((prev) => !prev)}
          className="absolute top-3 right-3 text-3xl leading-none transition-transform hover:scale-125 active:scale-95"
          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
        >
          {/* Inline style for the filled heart colour (can't use Tailwind for dynamic hex) */}
          <span style={fav ? { color: '#800E13' } : {}} className={!fav ? 'text-white/60' : ''}>
            {fav ? '♥' : '♡'}
          </span>
        </button>
      </div>

      {/* Product name and brand below the card */}
      <div className="mt-2.5 px-0.5">
        <p className="text-foreground text-sm font-medium truncate">{product.name}</p>
        <p className="text-muted text-xs truncate">{product.brand}</p>
      </div>
    </div>
  );
}
