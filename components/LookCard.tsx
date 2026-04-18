'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

export interface LookCardData {
  id: string;
  name: string;
  gradients: string[];
}

export default function LookCard({ look }: { look: LookCardData }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCycle() {
    if (look.gradients.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % look.gradients.length);
    }, 700);
  }

  function stopCycle() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setCurrent(0);
  }

  return (
    /* Outer wrapper handles pop-out scale — must be outside overflow-hidden */
    <div
      className="group cursor-pointer hover:scale-105 transition-transform duration-200 will-change-transform"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {/* Inner div clips the gradient and overlay */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        {/* Gradient background — cycles on hover */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: look.gradients[current] }}
        />

        {/* Bottom dark fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-foreground text-sm font-medium mb-2">{look.name}</p>
          <Link
            href={`/looks/${look.id}`}
            className="inline-block text-xs bg-accent text-white px-3 py-1.5 rounded-lg
                       opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
