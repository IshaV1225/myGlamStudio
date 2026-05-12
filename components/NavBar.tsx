'use client';

/**
 * components/NavBar.tsx — Persistent top navigation bar.
 *
 * APPEARS ON: every page inside app/(app)/ — injected by AppLayout.
 * DOES NOT APPEAR ON: login, register, onboarding (those use AuthLayout).
 *
 * THREE SECTIONS (CSS grid with 3 columns):
 *   Left  → nav links (desktop) / empty placeholder (mobile)
 *   Center → studio title (always centered regardless of screen size)
 *   Right  → settings + portfolio icons + sign out (desktop) / hamburger (mobile)
 *
 * KEY HOOKS USED:
 *
 * usePathname() — reads the current URL path (e.g. "/looks").
 * Used to highlight the active nav link. Re-runs automatically when you
 * navigate to a new page, so the highlight always stays in sync.
 *
 * useState(false) — tracks whether the mobile menu is open or closed.
 * A single boolean is enough because it's either open or it isn't.
 *
 * useUser() — reads the profile from UserContext to get the user's name
 * for the studio title (e.g. "Isha's Glam Studio").
 *
 * SIGN OUT FLOW:
 * supabase.auth.signOut() clears the JWT token from storage and fires
 * the onAuthStateChange listener in AuthContext, which sets session to null.
 * The AuthGuard in AppLayout detects the null session and redirects to /login.
 * The router.push('/login') here is a belt-and-suspenders backup.
 */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

// Nav links rendered in both desktop and mobile menus
const navLinks = [
  { href: '/looks',     label: 'My Looks' },
  { href: '/products',  label: 'My Products' },
  { href: '/inspo',     label: 'My Inspo' },
  { href: '/moodboard', label: 'Mood Board' },
];

export default function NavBar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useUser();

  async function handleSignOut() {
    // 1. Tell Supabase to invalidate the session token
    await supabase.auth.signOut();
    // 2. Navigate to login — AuthGuard also handles this, but explicit is cleaner
    router.push('/login');
  }

  // Returns true if the current page matches this nav link.
  // /looks/[id] should keep "My Looks" highlighted, so we use startsWith.
  function isActive(href: string) {
    if (href === '/home') return pathname === '/home';
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-primary/30 backdrop-blur-sm">
      {/* 3-column grid: [nav links] [title] [icons] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">

        {/* ── Left: desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors whitespace-nowrap ${
                isActive(href) ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Mobile: empty div keeps the 3-column grid balanced */}
        <div className="md:hidden" />

        {/* ── Center: studio title ── */}
        <div className="flex justify-center">
          <Link
            href="/home"
            className="text-accent text-2xl md:text-3xl hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{ fontFamily: "'Arcadian', Georgia, serif" }}
          >
            {profile.name}&apos;s Glam Studio
          </Link>
        </div>

        {/* ── Right: icon links + sign out (desktop) / hamburger (mobile) ── */}
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
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="text-muted hover:text-accent transition-colors text-sm"
            >
              Sign out
            </button>
          </div>

          {/* Mobile: hamburger toggles the dropdown menu */}
          <button
            className="md:hidden text-muted hover:text-foreground transition-colors text-2xl leading-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-primary/30 px-6 py-5 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)} // close menu on navigation
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
            <button
              onClick={handleSignOut}
              className="text-muted hover:text-accent transition-colors text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
