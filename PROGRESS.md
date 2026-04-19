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

## Batch 6 — My Brands + Products ✅
- [x] `contexts/ProductsContext.tsx` — Product + Brand types, mock data, provider, `useProducts()` hook
- [x] `app/(app)/products/page.tsx` — Top Products grid (heart toggle, max 20 favourites), All Products with Load More, Top Brands grid (clickable → external site, removable)
- [x] Add Product modal — name, brand, image upload placeholder, favourite toggle
- [x] Add Brand modal — name, optional website URL
- [x] `app/(app)/layout.tsx` — `ProductsProvider` added alongside `LooksProvider`

## Batch 7 — Mood Board ✅
- [x] `contexts/MoodBoardContext.tsx` — MoodBoard type, mock data, provider, `useMoodBoards()` hook, localStorage persistence
- [x] `app/(app)/moodboard/page.tsx` — 4-up grid preview cards, click-to-view popup with image grid + AI description section, Remove confirm modal, Add Board modal (name + image upload)
- [x] `app/(app)/layout.tsx` — `MoodBoardProvider` added

## Batch 8 — Settings + Beauty Portfolio ✅
- [x] `contexts/UserContext.tsx` — UserProfile type, defaults, provider, localStorage persistence
- [x] `app/(app)/settings/page.tsx` — Name, Email, Password, Location, Skin Type — each with Edit popup
- [x] `app/(app)/portfolio/page.tsx` — Hero gradient banner, Skin Type, Complexion, Preferred Brands, Preferred Looks (all editable), link to Products
- [x] `app/(app)/layout.tsx` — UserProvider added

## Batch 9 — Onboarding Quiz ✅
- [x] `app/(auth)/onboarding/page.tsx` — 9-step wizard: Name → Age → Skin Type → Skin Tone → Undertone → Preferred Looks → Preferred Brands → Location → Hero Image
- Progress bar with step counter, Back/Next navigation, skip support on optional steps
- Saves all fields to UserContext on finish, redirects to /home

## Batch 10 — My Inspo (placeholder) ✅
- [x] `app/(app)/inspo/page.tsx` — Coming Soon UI with blurred gradient mosaic background, preview card grid, 5 planned-feature cards, Pinterest early-access CTA linking to Mood Boards
