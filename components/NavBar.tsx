'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/looks',     label: 'My Looks' },
  { href: '/products',  label: 'My Products' },
  { href: '/inspo',     label: 'My Inspo' },
  { href: '/moodboard', label: 'Mood Board' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/home') return pathname === '/home';
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-primary/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">

        {/* Left — nav links (desktop) / empty (mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors whitespace-nowrap ${
                isActive(href)
                  ? 'text-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Mobile left — empty placeholder to keep grid balanced */}
        <div className="md:hidden" />

        {/* Center — studio title */}
        <div className="flex justify-center">
          <Link
            href="/home"
            className="text-accent text-2xl md:text-3xl hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{ fontFamily: "'Arcadian', Georgia, serif" }}
          >
            Isha&apos;s Glam Studio
          </Link>
        </div>

        {/* Right — icon links (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-end gap-5">
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/settings"
              title="Settings"
              className={`text-xl transition-colors ${isActive('/settings') ? 'text-accent' : 'text-muted hover:text-accent'}`}
            >
              ⚙️
            </Link>
            <Link
              href="/portfolio"
              title="Beauty Portfolio"
              className={`text-xl transition-colors ${isActive('/portfolio') ? 'text-accent' : 'text-muted hover:text-accent'}`}
            >
              💄
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-muted hover:text-foreground transition-colors text-2xl leading-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-primary/30 px-6 py-5 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm transition-colors ${
                isActive(href) ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-6 pt-3 border-t border-primary/30">
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="text-muted hover:text-accent transition-colors text-sm"
            >
              ⚙️ Settings
            </Link>
            <Link
              href="/portfolio"
              onClick={() => setMenuOpen(false)}
              className="text-muted hover:text-accent transition-colors text-sm"
            >
              💄 Beauty Portfolio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
