# Progress — Isha's Glam Studio

## Batch 1 — Design System Foundation ✅
- [x] `app/globals.css` — Ocean Sunset color tokens, Arcadian @font-face, base body styles (Tailwind v4)
- [x] `app/layout.tsx` — Clean metadata ("Isha's Glam Studio"), removed Geist fonts
- [x] `app/page.tsx` — Root redirect to /home
- [x] `app/home/page.tsx` — Placeholder home with color palette preview

> **Font note:** Arcadian font file must be placed at `public/fonts/Arcadian.woff2` (and optionally `.woff`). Until then, Georgia serif fallback renders.

---

## Batch 2 — Auth Pages ✅
- [x] `app/login/page.tsx` — email/password form, error state, links to register
- [x] `app/register/page.tsx` — name/email/password/confirm form, basic validation, links to login
> Auth calls are placeholder TODOs — real Firebase/Supabase wired in a later batch.

## Batch 3 — Navigation ✅
- [x] `components/NavBar.tsx` — sticky header, active link detection, mobile hamburger menu
- [x] `app/(app)/layout.tsx` — authenticated layout (injects NavBar above every app page)
- [x] `app/(auth)/layout.tsx` — minimal layout (no NavBar for login/register)
- [x] Pages reorganised into route groups: `(auth)` = login/register, `(app)` = home + all future pages

## Batch 4 — Home Page ✅
- [x] `app/(app)/home/page.tsx` — full home page with Hero, Top 5 Looks, Top Products
- [x] `components/LookCard.tsx` — hover image-cycling card (gradient placeholders until real images)
- [x] `components/ProductCard.tsx` — card with heart (♥) favourite toggle
- [x] `app/globals.css` — added `scrollbar-hide` utility
> Mock data used for all cards — replace with DB queries once Firebase/Supabase is wired.

## Batch 5 — My Looks ✅
- [x] `components/Modal.tsx` — reusable modal shell (backdrop blur, Escape key, body scroll lock)
- [x] `app/(app)/looks/page.tsx` — masonry grid, All / ★ Top 5 filter tabs, Add Look modal (name, images, toggle, steps, products)
- [x] `app/(app)/looks/[lookId]/page.tsx` — image carousel with dots + thumbnails, steps list, products, mood board links, remove confirm modal

## Batch 6 — My Brands + Products 🔜
- [ ] `app/products/page.tsx`
- [ ] Add Product modal, Add Brand modal

## Batch 7 — Mood Board 🔜
- [ ] `app/moodboard/page.tsx`
- [ ] Add Mood Board modal, AI description placeholder

## Batch 8 — Settings + Beauty Portfolio 🔜
- [ ] `app/settings/page.tsx`
- [ ] `app/portfolio/page.tsx`

## Batch 9 — Onboarding Quiz 🔜
- [ ] `app/onboarding/page.tsx` — Multi-step wizard

## Batch 10 — My Inspo (placeholder) 🔜
- [ ] `app/inspo/page.tsx` — Coming Soon UI
