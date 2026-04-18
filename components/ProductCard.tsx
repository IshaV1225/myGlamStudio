'use client';

import { useState } from 'react';

export interface ProductCardData {
  id: string;
  name: string;
  brand: string;
  gradient: string;
  isFavourite: boolean;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [fav, setFav] = useState(product.isFavourite);

  return (
    /* Outer wrapper handles pop-out scale — must be outside overflow-hidden */
    <div className="w-40 shrink-0 hover:scale-105 transition-transform duration-200 will-change-transform">
      <div
        className="w-full h-48 rounded-2xl relative overflow-hidden group"
        style={{ background: product.gradient }}
      >
        {/* Heart toggle */}
        <button
          onClick={() => setFav((prev) => !prev)}
          className="absolute top-3 right-3 text-2xl leading-none transition-transform hover:scale-125 active:scale-95"
          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
        >
          <span className={fav ? 'text-accent' : 'text-white/60'}>
            {fav ? '♥' : '♡'}
          </span>
        </button>
      </div>

      <div className="mt-2.5 px-0.5">
        <p className="text-foreground text-sm font-medium truncate">{product.name}</p>
        <p className="text-muted text-xs truncate">{product.brand}</p>
      </div>
    </div>
  );
}
