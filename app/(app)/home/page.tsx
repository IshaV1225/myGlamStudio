'use client';

/**
 * app/(app)/home/page.tsx — The main landing page after login.
 *
 * THIS PAGE IS A CONSUMER OF THREE CONTEXTS:
 *   useLooks()    → reads the looks array, filters for isTopFive = true
 *   useProducts() → reads the products array, filters for isFavourite = true
 *   useUser()     → reads profile.heroGradient for the banner
 *
 * WHY 'use client'?
 * This page uses hooks (useLooks, useProducts, useUser) which only work in
 * client components. Server components can't call hooks — they can only fetch
 * data directly from a database. Once Supabase is fully wired, we could move
 * the data fetching to a server component and only keep the interactive parts
 * (heart toggles, hover effects) client-side. For now, everything is client.
 *
 * DATA FLOW:
 *   LooksContext (updated on /looks page) → useLooks() here → top5 → LookCard
 *   ProductsContext (updated on /products page) → useProducts() here → favProducts → ProductCard
 *
 * Changes made on /looks or /products instantly appear here because they share
 * the same context — no page reload or data refetch needed.
 *
 * EMPTY STATES:
 * Both sections handle the case where the filtered array is empty, showing a
 * friendly message and a link to add content. Good UX always accounts for
 * zero-state (what does the page look like before the user has added anything?).
 */

import Link from 'next/link';
import { useLooks } from '@/contexts/LooksContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useUser } from '@/contexts/UserContext';
import LookCard from '@/components/LookCard';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const { looks }    = useLooks();
  const { products } = useProducts();
  const { profile }  = useUser();

  // Derived state — computed from the full arrays, not stored separately.
  // These update automatically whenever the underlying context arrays change.
  const top5        = looks.filter((l) => l.isTopFive);
  const favProducts = products.filter((p) => p.isFavourite);

  return (
    <div className="flex flex-col">

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      {/* Full-width decorative section. The gradient comes from the user's
          profile (set during onboarding or changed in Beauty Portfolio).
          The bottom fade blends into the page background (#EBF5FB). */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: profile.heroGradient }}
        />
        {/* Gradient fade from the hero into the page background below */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#EBF5FB] to-transparent" />
      </section>

      {/* ── Top 5 Looks ─────────────────────────────────────────────── */}
      <section className="py-14 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            {/* "5" is highlighted in accent colour to draw the eye */}
            <h2 className="text-2xl text-foreground">Top <span className="text-accent">5</span> Looks</h2>
            <Link href="/looks" className="text-accent text-sm hover:text-accent-light transition-colors">
              View all →
            </Link>
          </div>

          {/* Zero state: shown when no looks are marked as Top 5 */}
          {top5.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-muted">No Top 5 looks yet.</p>
              <Link href="/looks" className="text-accent text-sm hover:text-accent-light transition-colors">
                Go to My Looks to mark your favourites →
              </Link>
            </div>
          ) : (
            // Responsive grid: 2 columns on mobile → 3 on tablet → 5 on desktop
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {top5.map((look) => (
                // Only pass the fields LookCard needs — avoids coupling the card
                // to the full Look type (it doesn't need steps, productsUsed, etc.)
                <LookCard key={look.id} look={{ id: look.id, name: look.name, imageUrls: look.imageUrls }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Products ─────────────────────────────────────────────── */}
      <section className="py-14 bg-bg border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            {/* Count shown dynamically — updates as the user hearts/unhearts products */}
            <h2 className="text-2xl text-foreground">
              Top <span className="text-accent">{favProducts.length}</span> Products
            </h2>
            <Link href="/products" className="text-accent text-sm hover:text-accent-light transition-colors">
              View all →
            </Link>
          </div>

          {/* Zero state */}
          {favProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-muted">No favourite products yet.</p>
              <Link href="/products" className="text-accent text-sm hover:text-accent-light transition-colors">
                Go to My Products to heart your favourites →
              </Link>
            </div>
          ) : (
            // Horizontal scroll row — overflow-x-auto enables scrolling
            // scrollbar-hide hides the scrollbar visually (CSS utility in globals.css)
            // -mx / px trick extends the scroll area to the screen edge on mobile
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <div className="flex gap-5 pt-3 pb-4">
                {favProducts.map((p) => (
                  <ProductCard key={p.id} product={{ id: p.id, name: p.name, brand: p.brand, imageUrl: p.imageUrl, isFavourite: p.isFavourite }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
