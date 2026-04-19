'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  brand: string;
  gradient: string;
  isFavourite: boolean;
}

export interface Brand {
  id: string;
  name: string;
  websiteUrl?: string;
}

// ---------------------------------------------------------------------------
// Palette helper
// ---------------------------------------------------------------------------

const PALETTE = [
  'linear-gradient(135deg, #4B3B8C, #F4796B)',
  'linear-gradient(135deg, #7B3F6E, #F9B4A8)',
  'linear-gradient(135deg, #F4796B, #7B3F6E)',
  'linear-gradient(135deg, #1C1333, #4B3B8C)',
  'linear-gradient(135deg, #9B8DB0, #4B3B8C)',
  'linear-gradient(135deg, #F9B4A8, #7B3F6E)',
  'linear-gradient(135deg, #4B3B8C, #9B8DB0)',
  'linear-gradient(135deg, #0F0A1E, #7B3F6E)',
];

export function randomGradient(seed: number): string {
  return PALETTE[seed % PALETTE.length];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: "Pro Filt'r Foundation", brand: 'Fenty Beauty',        gradient: randomGradient(0), isFavourite: true  },
  { id: 'p2', name: 'Soft Pinch Liquid Blush', brand: 'Rare Beauty',       gradient: randomGradient(1), isFavourite: true  },
  { id: 'p3', name: 'Pillow Lips Gloss',       brand: 'Charlotte Tilbury', gradient: randomGradient(2), isFavourite: true  },
  { id: 'p4', name: 'Brow Wiz Pencil',         brand: 'Anastasia BH',      gradient: randomGradient(3), isFavourite: true  },
  { id: 'p5', name: 'Hypnôse Mascara',         brand: 'Lancôme',           gradient: randomGradient(4), isFavourite: true  },
  { id: 'p6', name: 'Setting Powder',          brand: 'Laura Mercier',     gradient: randomGradient(5), isFavourite: false },
  { id: 'p7', name: 'Lip Liner',              brand: 'Charlotte Tilbury',  gradient: randomGradient(6), isFavourite: false },
  { id: 'p8', name: 'Contour Stick',          brand: 'NYX',                gradient: randomGradient(7), isFavourite: false },
];

const INITIAL_BRANDS: Brand[] = [
  { id: 'b1', name: 'Fenty Beauty',        websiteUrl: 'https://fentybeauty.com'          },
  { id: 'b2', name: 'Charlotte Tilbury',   websiteUrl: 'https://charlottetilbury.com'      },
  { id: 'b3', name: 'Rare Beauty',         websiteUrl: 'https://rarebeauty.com'            },
  { id: 'b4', name: 'Anastasia Beverly Hills', websiteUrl: 'https://anastasiabeverlyhills.com' },
  { id: 'b5', name: 'Lancôme',             websiteUrl: 'https://lancome.com'               },
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ProductsCtx {
  products: Product[];
  brands: Brand[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  addBrand: (b: Brand) => void;
  removeBrand: (id: string) => void;
}

const ProductsContext = createContext<ProductsCtx | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [brands, setBrands]     = useState<Brand[]>(INITIAL_BRANDS);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    try {
      const p = localStorage.getItem('gs_products');
      if (p) setProducts(JSON.parse(p) as Product[]);
      const b = localStorage.getItem('gs_brands');
      if (b) setBrands(JSON.parse(b) as Brand[]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { localStorage.setItem('gs_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('gs_brands',   JSON.stringify(brands));   }, [brands]);

  function addProduct(p: Product)     { setProducts((prev) => [p, ...prev]); }
  function updateProduct(p: Product)  { setProducts((prev) => prev.map((x) => x.id === p.id ? p : x)); }
  function removeProduct(id: string)  { setProducts((prev) => prev.filter((x) => x.id !== id)); }
  function addBrand(b: Brand)         { setBrands((prev) => [b, ...prev]); }
  function removeBrand(id: string)    { setBrands((prev) => prev.filter((x) => x.id !== id)); }

  return (
    <ProductsContext.Provider value={{ products, brands, addProduct, updateProduct, removeProduct, addBrand, removeBrand }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider');
  return ctx;
}
