'use client';

/**
 * components/LookCard.tsx — Card for a single look (home page Top 5 grid).
 *
 * TWO BEHAVIOURS IN ONE CARD:
 * 1. Hover → gradient cycles through the look's images (useRef + setInterval)
 * 2. Click anywhere → navigates to /looks/[id] (the whole card is a <Link>)
 *
 * WHY useRef FOR THE TIMER (not useState)?
 * useState causes a re-render every time it changes. The interval ID (a number)
 * doesn't affect what the UI looks like — it's just a handle we need to clear
 * the interval later. Storing it in a useRef avoids unnecessary re-renders.
 * Rule of thumb: if a value doesn't need to appear in the UI, use useRef.
 *
 * WHY setInterval INSTEAD OF useEffect?
 * setInterval is started manually on mouseenter and stopped on mouseleave —
 * it's user-driven, not lifecycle-driven. useEffect would run automatically
 * when the component mounts, which we don't want here.
 *
 * THE LINK WRAPPER TRICK:
 * Wrapping the whole card in a Next.js <Link> means clicking anywhere on the
 * card navigates to the look's detail page. No separate "View Details" button
 * needed. Next.js <Link> prefetches the destination page on hover, making
 * navigation feel instant.
 */

import Link from 'next/link';
import { useRef, useState } from 'react';

export interface LookCardData {
  id: string;
  name: string;
  imageUrls: string[]; // one entry per image in this look's gallery
}

export default function LookCard({ look }: { look: LookCardData }) {
  // Tracks which gradient (image) is currently shown
  const [current, setCurrent] = useState(0);
  // Holds the setInterval ID so we can cancel it on mouseleave
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start cycling through gradients when the user hovers
  function startCycle() {
    if (look.imageUrls.length <= 1) return; // nothing to cycle if only one image
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % look.imageUrls.length); // wrap around at the end
    }, 700); // switch every 700ms
  }

  // Stop cycling and reset to the first gradient when hover ends
  function stopCycle() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setCurrent(0);
  }

  return (
    // The entire card is a link — clicking anywhere navigates to the detail page
    <Link
      href={`/looks/${look.id}`}
      className="group block hover:scale-105 transition-transform duration-200 will-change-transform"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {/* Card visual — overflow-hidden clips the gradient to the rounded corners */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        {/* Gradient — changes smoothly via CSS transition when `current` changes */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: look.imageUrls[current] }}
        />
        {/* Subtle bottom fade so the name below has visual separation */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Look name — always visible below the card */}
      <p className="mt-2 px-0.5 text-sm text-foreground font-medium truncate">
        {look.name}
      </p>
    </Link>
  );
}
