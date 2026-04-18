import Link from 'next/link';
import LookCard, { LookCardData } from '@/components/LookCard';
import ProductCard, { ProductCardData } from '@/components/ProductCard';

// ---------------------------------------------------------------------------
// Mock data — replace with real Firestore / Supabase queries once DB is wired
// ---------------------------------------------------------------------------

const mockLooks: LookCardData[] = [
  {
    id: '1',
    name: 'Evening Glam',
    gradients: [
      'linear-gradient(135deg, #4B3B8C, #7B3F6E)',
      'linear-gradient(135deg, #7B3F6E, #F4796B)',
      'linear-gradient(135deg, #F4796B, #4B3B8C)',
    ],
  },
  {
    id: '2',
    name: 'Smoky Eye',
    gradients: [
      'linear-gradient(135deg, #0F0A1E, #4B3B8C)',
      'linear-gradient(135deg, #4B3B8C, #1C1333)',
    ],
  },
  {
    id: '3',
    name: 'Natural Flush',
    gradients: [
      'linear-gradient(135deg, #F9B4A8, #F4796B)',
      'linear-gradient(135deg, #F4796B, #7B3F6E)',
    ],
  },
  {
    id: '4',
    name: 'Sunset Drama',
    gradients: [
      'linear-gradient(135deg, #7B3F6E, #F4796B)',
      'linear-gradient(135deg, #F4796B, #F9B4A8)',
      'linear-gradient(135deg, #F9B4A8, #7B3F6E)',
    ],
  },
  {
    id: '5',
    name: 'Clean Girl',
    gradients: [
      'linear-gradient(135deg, #9B8DB0, #1C1333)',
      'linear-gradient(135deg, #1C1333, #4B3B8C)',
    ],
  },
];

const mockProducts: ProductCardData[] = [
  { id: '1', name: 'Pro Filt\'r Foundation', brand: 'Fenty Beauty',     gradient: 'linear-gradient(135deg, #4B3B8C, #F4796B)', isFavourite: true  },
  { id: '2', name: 'Lip Liner',             brand: 'Charlotte Tilbury', gradient: 'linear-gradient(135deg, #7B3F6E, #F9B4A8)', isFavourite: true  },
  { id: '3', name: 'Setting Powder',        brand: 'Laura Mercier',     gradient: 'linear-gradient(135deg, #F9B4A8, #9B8DB0)', isFavourite: false },
  { id: '4', name: 'Mascara',               brand: 'Lancôme',           gradient: 'linear-gradient(135deg, #0F0A1E, #4B3B8C)', isFavourite: true  },
  { id: '5', name: 'Blush Stick',           brand: 'Rare Beauty',       gradient: 'linear-gradient(135deg, #F4796B, #7B3F6E)', isFavourite: true  },
  { id: '6', name: 'Brow Pencil',           brand: 'Anastasia BH',      gradient: 'linear-gradient(135deg, #1C1333, #7B3F6E)', isFavourite: false },
];

const favouriteCount = mockProducts.filter((p) => p.isFavourite).length;

// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0F0A1E 0%, #4B3B8C 40%, #7B3F6E 70%, #F4796B 100%)',
          }}
        />

        {/* Soft glow orbs */}
        <div className="absolute top-16 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-30"
             style={{ background: '#4B3B8C' }} />
        <div className="absolute bottom-16 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-25"
             style={{ background: '#F4796B' }} />

        {/* Bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1
            className="text-6xl md:text-8xl text-foreground drop-shadow-lg"
            style={{ fontFamily: "'Arcadian', Georgia, serif" }}
          >
            Isha&apos;s Glam Studio
          </h1>
          <p className="mt-4 text-accent-light text-lg md:text-xl">
            Your personal beauty sanctuary.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/looks"
              className="bg-accent text-white px-8 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              My Looks
            </Link>
            <Link
              href="/portfolio"
              className="border border-accent text-accent px-8 py-3 rounded-lg hover:bg-accent/10 active:scale-95 transition-all"
            >
              Beauty Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Top 5 Looks ──────────────────────────────────────────── */}
      <section className="py-14 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-foreground">Top 5 Looks</h2>
            <Link
              href="/looks"
              className="text-accent text-sm hover:text-accent-light transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockLooks.map((look) => (
              <LookCard key={look.id} look={look} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Products ─────────────────────────────────────────── */}
      <section className="py-14 bg-bg border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-foreground">
              Top{' '}
              <span className="text-accent">{favouriteCount}</span>{' '}
              Products
            </h2>
            <Link
              href="/products"
              className="text-accent text-sm hover:text-accent-light transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <div className="flex gap-5 pt-3 pb-4">
              {mockProducts.filter((p) => p.isFavourite).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
