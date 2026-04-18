'use client';

import Link from 'next/link';
import { useState } from 'react';
import Modal from '@/components/Modal';
import { useLooks, makeGradients, type Look } from '@/contexts/LooksContext';

// ---------------------------------------------------------------------------

const inputCls =
  'w-full bg-bg border border-primary rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm';

const HEIGHT_CLASSES = ['h-56', 'h-64', 'h-72', 'h-80'];

export default function LooksPage() {
  const { looks, addLook } = useLooks();

  const [filter, setFilter]   = useState<'all' | 'top5'>('all');
  const [addOpen, setAddOpen] = useState(false);

  // ── Add Look form state ──────────────────────────────────────────────────
  const [newName, setNewName]       = useState('');
  const [newTopFive, setNewTopFive] = useState(false);
  const [newSteps, setNewSteps]     = useState(['']);
  const [newProducts, setNewProducts] = useState<string[]>([]);
  const [productInput, setProductInput] = useState('');
  const [imageCount, setImageCount] = useState(0);

  const top5Count = looks.filter((l) => l.isTopFive).length;
  const filtered  = filter === 'top5' ? looks.filter((l) => l.isTopFive) : looks;

  // Steps helpers
  function addStep() { setNewSteps((s) => [...s, '']); }
  function removeStep(i: number) { setNewSteps((s) => s.filter((_, idx) => idx !== i)); }
  function updateStep(i: number, val: string) {
    setNewSteps((s) => s.map((step, idx) => (idx === i ? val : step)));
  }

  // Product helpers
  function commitProduct() {
    const trimmed = productInput.trim();
    if (!trimmed || newProducts.includes(trimmed)) return;
    setNewProducts((prev) => [...prev, trimmed]);
    setProductInput('');
  }
  function removeProduct(p: string) {
    setNewProducts((prev) => prev.filter((x) => x !== p));
  }

  function resetForm() {
    setNewName(''); setNewTopFive(false); setNewSteps(['']);
    setNewProducts([]); setProductInput(''); setImageCount(0);
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newName.trim()) return;
    if (newTopFive && top5Count >= 5) return;

    const newLook: Look = {
      id: Date.now().toString(),
      name: newName.trim(),
      isTopFive: newTopFive,
      heightClass: HEIGHT_CLASSES[Math.floor(Math.random() * HEIGHT_CLASSES.length)],
      gradients: makeGradients(imageCount || 1),
      steps: newSteps.filter(Boolean),
      productsUsed: newProducts,
      moodBoards: [],
    };

    addLook(newLook);
    resetForm();
    setAddOpen(false);
  }

  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl text-foreground">My Looks</h1>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-accent text-white px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            + Add Look
          </button>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 mb-8">
          {(['all', 'top5'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f ? 'bg-primary text-foreground' : 'bg-surface text-muted hover:text-foreground'
              }`}
            >
              {f === 'all' ? `All Looks (${looks.length})` : `★ Top 5 (${top5Count})`}
            </button>
          ))}
        </div>

        {/* ── Masonry grid ── */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {filtered.map((look) => (
            <div
              key={look.id}
              className="break-inside-avoid mb-4 hover:scale-[1.02] transition-transform duration-200 will-change-transform"
            >
              <Link href={`/looks/${look.id}`} className="block relative rounded-2xl overflow-hidden group">
                {/* Cover image */}
                <div className={`w-full ${look.heightClass}`} style={{ background: look.gradients[0] }} />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {look.isTopFive && (
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">★ Top 5</span>
                  )}
                  {look.gradients.length > 1 && (
                    <span className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                      {look.gradients.length} photos
                    </span>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {look.name}
                  </p>
                  <span className="inline-block mt-1.5 text-xs bg-accent text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View Look →
                  </span>
                </div>
              </Link>

              <p className="mt-2 px-1 text-sm text-muted">{look.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Look Modal ── */}
      <Modal open={addOpen} onClose={() => { resetForm(); setAddOpen(false); }} title="Add New Look">
        <form onSubmit={handleAdd} className="space-y-5">

          {/* Name */}
          <div className="space-y-1">
            <label className="text-muted text-sm">Look Name *</label>
            <input
              required value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Summer Glow"
              className={inputCls}
            />
          </div>

          {/* Images */}
          <div className="space-y-1">
            <label className="text-muted text-sm">
              Images{imageCount > 0 && <span className="text-accent ml-2">{imageCount} selected</span>}
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-accent transition-colors text-muted text-sm gap-1">
              <span className="text-2xl">📷</span>
              <span>{imageCount > 0 ? `${imageCount} image${imageCount > 1 ? 's' : ''} — click to change` : 'Click to upload images'}</span>
              <input
                type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setImageCount(e.target.files?.length ?? 0)}
              />
            </label>
            {imageCount > 1 && (
              <p className="text-muted/60 text-xs">Each image will appear as a separate slide on the look page.</p>
            )}
          </div>

          {/* Make Top 5 */}
          <div className="flex items-center justify-between bg-bg rounded-lg px-4 py-3">
            <span className="text-sm text-foreground">Make Top 5?</span>
            <button
              type="button"
              onClick={() => setNewTopFive((v) => !v)}
              disabled={!newTopFive && top5Count >= 5}
              className={`w-10 h-6 rounded-full transition-colors relative ${newTopFive ? 'bg-accent' : 'bg-primary/40'} disabled:opacity-40`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newTopFive ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
          {top5Count >= 5 && !newTopFive && (
            <p className="text-muted text-xs -mt-3">Top 5 is full — remove a look first.</p>
          )}

          {/* Steps */}
          <div className="space-y-2">
            <label className="text-muted text-sm">Steps & Techniques</label>
            {newSteps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={step} onChange={(e) => updateStep(i, e.target.value)}
                  placeholder={`Step ${i + 1}`}
                  className={`${inputCls} flex-1`}
                />
                {newSteps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)}
                    className="text-muted hover:text-accent transition-colors text-lg leading-none">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStep}
              className="text-accent text-sm hover:text-accent-light transition-colors">+ Add step</button>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <label className="text-muted text-sm">Products Used</label>

            <div className="flex gap-2">
              <input
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitProduct(); } }}
                placeholder="Add product name and brand"
                className={`${inputCls} flex-1`}
              />
              <button
                type="button" onClick={commitProduct}
                className="shrink-0 bg-primary text-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition-colors"
              >
                Add
              </button>
            </div>

            {newProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {newProducts.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 text-xs bg-accent/15 border border-accent/40 text-accent pl-3 pr-2 py-1.5 rounded-full">
                    {p}
                    <button type="button" onClick={() => removeProduct(p)}
                      className="text-accent/60 hover:text-accent transition-colors leading-none">✕</button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted/50 text-xs">No products yet — type above and press Add or Enter.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 active:scale-95 transition-all"
          >
            Save Look
          </button>
        </form>
      </Modal>
    </div>
  );
}
