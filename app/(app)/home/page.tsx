'use client';

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

  const top5     = looks.filter((l) => l.isTopFive);
  const favProducts = products.filter((p) => p.isFavourite);

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: profile.heroGradient }}
        />
        {/* Soft fade into page below */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-bg to-transparent" />
      </section>

      {/* ── Top 5 Looks ──────────────────────────────────────────── */}
      <section className="py-14 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-foreground">Top 5 Looks</h2>
            <Link href="/looks" className="text-accent text-sm hover:text-accent-light transition-colors">
              View all →
            </Link>
          </div>

          {top5.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-muted">No Top 5 looks yet.</p>
              <Link href="/looks" className="text-accent text-sm hover:text-accent-light transition-colors">
                Go to My Looks to mark your favourites →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {top5.map((look) => (
                <LookCard key={look.id} look={{ id: look.id, name: look.name, gradients: look.gradients }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Products ─────────────────────────────────────────── */}
      <section className="py-14 bg-bg border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-foreground">
              Top <span className="text-accent">{favProducts.length}</span> Products
            </h2>
            <Link href="/products" className="text-accent text-sm hover:text-accent-light transition-colors">
              View all →
            </Link>
          </div>

          {favProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-muted">No favourite products yet.</p>
              <Link href="/products" className="text-accent text-sm hover:text-accent-light transition-colors">
                Go to My Products to heart your favourites →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <div className="flex gap-5 pt-3 pb-4">
                {favProducts.map((p) => (
                  <ProductCard key={p.id} product={{ id: p.id, name: p.name, brand: p.brand, gradient: p.gradient, isFavourite: p.isFavourite }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
