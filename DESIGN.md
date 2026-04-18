# Design Decisions — Isha's Glam Studio

## Font
- **Primary:** Arcadian (Canva) — configured via `@font-face` in `globals.css`
- **File location:** `public/fonts/Arcadian.woff2` (user must add the font file manually)
- **Fallback:** `Georgia, serif` (renders until font file is present)

## Color Palette — "Ocean Sunset"
Defined as `@theme` tokens in `globals.css` (Tailwind v4 pattern — no `tailwind.config.js` needed).

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#4B3B8C` | Deep Indigo — primary buttons, active states |
| `--color-secondary` | `#7B3F6E` | Deep Plum — secondary elements |
| `--color-accent` | `#F4796B` | Coral Pink — CTAs, highlights, headings |
| `--color-accent-light` | `#F9B4A8` | Soft Coral — hover states, tags |
| `--color-bg` | `#0F0A1E` | Near-black indigo — page background |
| `--color-surface` | `#1C1333` | Card and panel background |
| `--color-foreground` | `#F5EEF8` | Off-white — body text |
| `--color-muted` | `#9B8DB0` | Muted labels and secondary text |

Tailwind utility classes auto-generated: `bg-primary`, `text-accent`, `bg-surface`, `text-muted`, etc.

## Tech Stack Decisions
- **Next.js 16.2.4** with App Router — file-based routing under `app/`
- **Tailwind CSS v4** — `@theme` block in CSS replaces `tailwind.config.js`
- **TypeScript** throughout
- **Database/Auth:** Firebase or Supabase — TBD (will integrate in a later batch)
- **No extra state library for now** — React Context + useState (Zustand if it grows)

## Button Style
- `rounded-lg` (8px radius), consistent across all CTAs, modals, forms
- Primary CTA: `bg-accent text-white hover:bg-accent-light`
- Secondary: `bg-surface text-foreground border border-primary`

## Layout
- NavBar: persistent on all pages except `/login`, `/register`, `/onboarding`
- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Fully responsive — mobile-first
