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
    <Link
      href={`/looks/${look.id}`}
      className="group block hover:scale-105 transition-transform duration-200 will-change-transform"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: look.gradients[current] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      <p className="mt-2 px-0.5 text-sm text-foreground font-medium truncate">
        {look.name}
      </p>
    </Link>
  );
}
