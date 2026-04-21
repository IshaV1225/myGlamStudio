# Design Decisions — Isha's Glam Studio

## Font
- **Primary:** Arcadian (Canva) — configured via `@font-face` in `globals.css`
- **File location:** `public/fonts/Arcadian.woff2` (user must add the font file manually)
- **Fallback:** `Georgia, serif` (renders until font file is present)

## Color Palette — "Pastel Dream"
Defined as `@theme` tokens in `globals.css` (Tailwind v4 pattern — no `tailwind.config.js` needed).

| Token | Value | Name | Usage |
|---|---|---|---|
| `--color-primary` | `#CDB4DB` | Pink Orchid | Primary buttons, active states |
| `--color-secondary` | `#A2D2FF` | Sky Blue | Secondary elements |
| `--color-accent` | `#FFAFCC` | Blush Pop | CTAs, highlights |
| `--color-accent-light` | `#FFC8DD` | Pastel Petal | Hover states, tags |
| `--color-bg` | `#EBF5FB` | Baby Blue | Page background |
| `--color-surface` | `#D6ECFA` | Soft Blue | Card and panel background |
| `--color-foreground` | `#1A0D2E` | Deep Purple-Black | Body text |
| `--color-muted` | `#6B9EC4` | Muted Blue-Grey | Labels and secondary text |

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
