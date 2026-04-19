'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { useProducts, randomGradient, type Product } from '@/contexts/ProductsContext';

// ---------------------------------------------------------------------------

const inputCls =
  'w-full bg-bg border border-primary rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm';

const MAX_FAVOURITES = 20;

// ---------------------------------------------------------------------------
// Product lightbox popup
// ---------------------------------------------------------------------------

function ProductLightbox({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none z-10">✕</button>

      <div
        className="relative w-72 sm:w-80 rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: product.gradient }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full aspect-3/4" />

        {/* Name overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-5">
          <p className="text-white text-lg font-medium">{product.name}</p>
          <p className="text-white/60 text-sm">{product.brand}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini product card (self-contained favourite toggle)
// ---------------------------------------------------------------------------

function ProductTile({
  product,
  onToggleFav,
  onRemove,
  onOpen,
}: {
  product: Product;
  onToggleFav: () => void;
  onRemove: () => void;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative hover:scale-[1.03] transition-transform duration-200 will-change-transform cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      <div className="rounded-2xl overflow-hidden relative" style={{ background: product.gradient }}>
        <div className="w-full h-56" />

        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          className="absolute top-3 right-3 text-2xl leading-none transition-transform hover:scale-125 active:scale-95"
          aria-label={product.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <span className={product.isFavourite ? 'text-accent' : 'text-white/60'}>
            {product.isFavourite ? '♥' : '♡'}
          </span>
        </button>

        {/* Remove button */}
        {hovered && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-3 left-3 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-accent transition-colors"
            aria-label="Remove product"
          >✕</button>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <p className="text-foreground text-sm font-medium truncate">{product.name}</p>
        <p className="text-muted text-xs truncate">{product.brand}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProductsPage() {
  const { products, brands, addProduct, updateProduct, removeProduct, addBrand, removeBrand } = useProducts();

  const favCount    = products.filter((p) => p.isFavourite).length;
  const favourites  = products.filter((p) => p.isFavourite);
  const allProducts = products;

  // ── Lightbox ──
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ── Show more ──
  const PAGE_SIZE = 12;
  const [shown, setShown] = useState(PAGE_SIZE);

  // ── Add Product modal ──
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newName, setNewName]               = useState('');
  const [newBrand, setNewBrand]             = useState('');
  const [newFav, setNewFav]                 = useState(false);

  function resetProductForm() { setNewName(''); setNewBrand(''); setNewFav(false); }

  function handleAddProduct(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!newName.trim()) return;
    if (newFav && favCount >= MAX_FAVOURITES) return;

    const seed = products.length;
    addProduct({
      id: Date.now().toString(),
      name: newName.trim(),
      brand: newBrand.trim() || 'Unknown Brand',
      gradient: randomGradient(seed),
      isFavourite: newFav,
    });
    resetProductForm();
    setAddProductOpen(false);
  }

  // ── Add Brand modal ──
  const [addBrandOpen, setAddBrandOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandUrl, setNewBrandUrl]   = useState('');

  function resetBrandForm() { setNewBrandName(''); setNewBrandUrl(''); }

  function handleAddBrand(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    addBrand({
      id: Date.now().toString(),
      name: newBrandName.trim(),
      websiteUrl: newBrandUrl.trim() || undefined,
    });
    resetBrandForm();
    setAddBrandOpen(false);
  }

  // ── Toggle favourite ──
  function toggleFav(product: Product) {
    if (!product.isFavourite && favCount >= MAX_FAVOURITES) return;
    updateProduct({ ...product, isFavourite: !product.isFavourite });
  }

  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14">

        {/* ══ Section 1 — Top Products ══ */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl text-foreground">
              Top Products
              <span className="ml-3 text-muted text-lg">({favCount}/{MAX_FAVOURITES})</span>
            </h2>
            <button
              onClick={() => setAddProductOpen(true)}
              className="bg-accent text-white px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all text-sm"
            >
              + Add Product
            </button>
          </div>

          {favourites.length === 0 ? (
            <p className="text-muted/60 text-sm">No favourite products yet — heart a product to feature it here.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favourites.map((p) => (
                <ProductTile
                  key={p.id}
                  product={p}
                  onToggleFav={() => toggleFav(p)}
                  onRemove={() => removeProduct(p.id)}
                  onOpen={() => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

          {/* All products below the favourites */}
          {(() => {
            const nonFav = allProducts.filter((p) => !p.isFavourite);
            if (nonFav.length === 0) return null;
            const visible = nonFav.slice(0, shown);
            return (
              <>
                <h3 className="text-lg text-muted mt-10 mb-4">All Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {visible.map((p) => (
                    <ProductTile
                      key={p.id}
                      product={p}
                      onToggleFav={() => toggleFav(p)}
                      onRemove={() => removeProduct(p.id)}
                      onOpen={() => setSelectedProduct(p)}
                    />
                  ))}
                </div>
                {nonFav.length > shown && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShown((n) => n + PAGE_SIZE)}
                      className="px-6 py-2.5 rounded-lg bg-surface border border-primary/40 text-muted hover:text-foreground transition-colors text-sm"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </section>

        {/* ══ Section 2 — Brands ══ */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl text-foreground">Top Brands</h2>
            <button
              onClick={() => setAddBrandOpen(true)}
              className="bg-accent text-white px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all text-sm"
            >
              + Add Brand
            </button>
          </div>

          {brands.length === 0 ? (
            <p className="text-muted/60 text-sm">No brands yet — add one above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <div key={brand.id} className="group relative">
                  <a
                    href={brand.websiteUrl ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-surface border border-primary/30 rounded-2xl px-4 py-6 text-center hover:border-accent/60 hover:bg-primary/10 transition-all duration-200"
                  >
                    <p className="text-foreground text-sm font-medium truncate">{brand.name}</p>
                    {brand.websiteUrl && (
                      <p className="text-muted/60 text-xs mt-1 truncate">↗ Visit site</p>
                    )}
                  </a>
                  <button
                    onClick={() => removeBrand(brand.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface border border-primary/40 text-muted text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-accent hover:border-accent/40 transition-all"
                    aria-label="Remove brand"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Product Lightbox ── */}
      {selectedProduct && (
        <ProductLightbox product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* ── Add Product Modal ── */}
      <Modal open={addProductOpen} onClose={() => { resetProductForm(); setAddProductOpen(false); }} title="Add Product">
        <form onSubmit={handleAddProduct} className="space-y-5">

          <div className="space-y-1">
            <label className="text-muted text-sm">Product Name *</label>
            <input required value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Soft Pinch Liquid Blush" className={inputCls} />
          </div>

          <div className="space-y-1">
            <label className="text-muted text-sm">Brand</label>
            <input value={newBrand} onChange={(e) => setNewBrand(e.target.value)}
              placeholder="e.g. Rare Beauty" className={inputCls} />
          </div>

          {/* Image upload placeholder */}
          <div className="space-y-1">
            <label className="text-muted text-sm">Product Image</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-accent transition-colors text-muted text-sm gap-1">
              <span className="text-2xl">📷</span>
              <span>Click to upload</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          {/* Favourite toggle */}
          <div className="flex items-center justify-between bg-bg rounded-lg px-4 py-3">
            <span className="text-sm text-foreground">Add to Favourites?</span>
            <button
              type="button"
              onClick={() => setNewFav((v) => !v)}
              disabled={!newFav && favCount >= MAX_FAVOURITES}
              className={`w-10 h-6 rounded-full transition-colors relative ${newFav ? 'bg-accent' : 'bg-primary/40'} disabled:opacity-40`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newFav ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
          {!newFav && favCount >= MAX_FAVOURITES && (
            <p className="text-muted text-xs -mt-3">Favourites full ({MAX_FAVOURITES} max) — unfavourite a product first.</p>
          )}

          <button type="submit"
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 active:scale-95 transition-all">
            Save Product
          </button>
        </form>
      </Modal>

      {/* ── Add Brand Modal ── */}
      <Modal open={addBrandOpen} onClose={() => { resetBrandForm(); setAddBrandOpen(false); }} title="Add Brand">
        <form onSubmit={handleAddBrand} className="space-y-5">

          <div className="space-y-1">
            <label className="text-muted text-sm">Brand Name *</label>
            <input required value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="e.g. NARS Cosmetics" className={inputCls} />
          </div>

          <div className="space-y-1">
            <label className="text-muted text-sm">Website URL</label>
            <input value={newBrandUrl} onChange={(e) => setNewBrandUrl(e.target.value)}
              placeholder="https://narscosmeticss.com" className={inputCls} />
          </div>

          <button type="submit"
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 active:scale-95 transition-all">
            Save Brand
          </button>
        </form>
      </Modal>
    </div>
  );
}
