'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;      // CSS gradient now; real image URL after step 2 (uploads)
  isFavourite: boolean;
}

export interface Brand {
  id: string;
  name: string;
  websiteUrl?: string;
}

// ---------------------------------------------------------------------------
// Gradient palette — placeholder images until real uploads are wired (step 2)
// ---------------------------------------------------------------------------

const PALETTE = [
  'linear-gradient(135deg, #CDB4DB, #FFAFCC)',
  'linear-gradient(135deg, #FFAFCC, #FFC8DD)',
  'linear-gradient(135deg, #FFC8DD, #A2D2FF)',
  'linear-gradient(135deg, #A2D2FF, #CDB4DB)',
  'linear-gradient(135deg, #BDE0FE, #FFAFCC)',
  'linear-gradient(135deg, #FFC8DD, #BDE0FE)',
  'linear-gradient(135deg, #CDB4DB, #A2D2FF)',
  'linear-gradient(135deg, #FFAFCC, #BDE0FE)',
];

export function randomGradient(seed: number): string {
  return PALETTE[seed % PALETTE.length];
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ProductsCtx {
  products: Product[];
  brands:   Brand[];
  addProduct:    (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (p: Product)             => Promise<void>;
  removeProduct: (id: string)             => Promise<void>;
  addBrand:      (b: Omit<Brand, 'id'>)   => Promise<void>;
  removeBrand:   (id: string)             => Promise<void>;
}

const ProductsContext = createContext<ProductsCtx | null>(null);

// ---------------------------------------------------------------------------
// DB ↔ TypeScript mappers
// ---------------------------------------------------------------------------

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id:          row.id            as string,
    name:        row.name          as string,
    brand:       (row.brand        as string)  ?? '',
    imageUrl:    (row.image_url    as string)  || randomGradient(0),
    isFavourite: (row.is_favourite as boolean) ?? false,
  };
}

function rowToBrand(row: Record<string, unknown>): Brand {
  return {
    id:         row.id           as string,
    name:       row.name         as string,
    websiteUrl: (row.website_url as string) || undefined,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands,   setBrands]   = useState<Brand[]>([]);
  const userId = session?.user.id;

  // Fetch both arrays in parallel when the user logs in.
  // No synchronous setState — initial state is already [].
  useEffect(() => {
    if (!userId) return;

    Promise.all([
      supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('brands').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]).then(([{ data: pData }, { data: bData }]) => {
      if (pData) setProducts(pData.map(rowToProduct));
      if (bData) setBrands(bData.map(rowToBrand));
    });
  }, [userId]);

  async function addProduct(p: Omit<Product, 'id'>) {
    if (!userId) return;
    const { data } = await supabase
      .from('products')
      .insert({ user_id: userId, name: p.name, brand: p.brand, image_url: p.imageUrl, is_favourite: p.isFavourite })
      .select()
      .single();
    if (data) setProducts((prev) => [rowToProduct(data), ...prev]);
  }

  async function updateProduct(p: Product) {
    if (!userId) return;
    await supabase
      .from('products')
      .update({ name: p.name, brand: p.brand, image_url: p.imageUrl, is_favourite: p.isFavourite })
      .eq('id', p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));
  }

  async function removeProduct(id: string) {
    if (!userId) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
  }

  async function addBrand(b: Omit<Brand, 'id'>) {
    if (!userId) return;
    const { data } = await supabase
      .from('brands')
      .insert({ user_id: userId, name: b.name, website_url: b.websiteUrl ?? null })
      .select()
      .single();
    if (data) setBrands((prev) => [rowToBrand(data), ...prev]);
  }

  async function removeBrand(id: string) {
    if (!userId) return;
    await supabase.from('brands').delete().eq('id', id);
    setBrands((prev) => prev.filter((x) => x.id !== id));
  }

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
