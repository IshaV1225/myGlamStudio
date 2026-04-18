'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { useLooks, makeGradients } from '@/contexts/LooksContext';

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

function Lightbox({
  gradients, startIndex, onClose,
}: { gradients: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const total = gradients.length;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  setIdx((i) => (i - 1 + total) % total);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % total);
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [onClose, total]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none z-10">✕</button>
      {total > 1 && <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">{idx + 1} / {total}</span>}
      {total > 1 && <>
        <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + total) % total); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center z-10">‹</button>
        <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % total); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center z-10">›</button>
      </>}
      <div className="w-full max-w-lg mx-16 aspect-3/4 rounded-2xl transition-all duration-500"
        style={{ background: gradients[idx] }} onClick={(e) => e.stopPropagation()} />
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {gradients.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared input style
// ---------------------------------------------------------------------------

const inputCls = 'w-full bg-bg border border-primary rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm';

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LookDetailPage() {
  const { lookId } = useParams<{ lookId: string }>();
  const router = useRouter();
  const { looks, updateLook, removeLook } = useLooks();

  const look = looks.find((l) => l.id === lookId);
  const top5Count = looks.filter((l) => l.isTopFive).length;

  const [currentImg, setCurrentImg]     = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [editOpen, setEditOpen]         = useState(false);

  // Edit form state
  const [editName, setEditName]           = useState('');
  const [editTopFive, setEditTopFive]     = useState(false);
  const [editSteps, setEditSteps]         = useState<string[]>([]);
  const [editProducts, setEditProducts]   = useState<string[]>([]);
  const [productInput, setProductInput]   = useState('');
  const [editGradients, setEditGradients] = useState<string[]>([]);
  const [newImgCount, setNewImgCount]     = useState(0);

  // Hover auto-rotation
  const rotationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startRotation() {
    if (!look || look.gradients.length <= 1) return;
    rotationRef.current = setInterval(() => setCurrentImg((i) => (i + 1) % look.gradients.length), 3000);
  }
  function stopRotation() {
    if (rotationRef.current) clearInterval(rotationRef.current);
    rotationRef.current = null;
  }
  function openLightbox() { stopRotation(); setLightboxOpen(true); }
  useEffect(() => () => stopRotation(), []);

  // Open edit modal pre-filled with current look data
  function openEdit() {
    if (!look) return;
    setEditName(look.name);
    setEditTopFive(look.isTopFive);
    setEditSteps(look.steps.length ? [...look.steps] : ['']);
    setEditProducts([...look.productsUsed]);
    setEditGradients([...look.gradients]);
    setProductInput('');
    setNewImgCount(0);
    setEditOpen(true);
  }

  // Steps helpers
  function addStep()                    { setEditSteps((s) => [...s, '']); }
  function removeStep(i: number)        { setEditSteps((s) => s.filter((_, idx) => idx !== i)); }
  function updateStep(i: number, v: string) { setEditSteps((s) => s.map((x, idx) => idx === i ? v : x)); }

  // Product helpers
  function commitProduct() {
    const t = productInput.trim();
    if (!t || editProducts.includes(t)) return;
    setEditProducts((p) => [...p, t]);
    setProductInput('');
  }
  function removeProduct(p: string) { setEditProducts((prev) => prev.filter((x) => x !== p)); }

  // Remove one existing image slide
  function removeImage(i: number) {
    setEditGradients((g) => g.filter((_, idx) => idx !== i));
  }

  // Can this look be toggled into Top 5?
  function canMakeTop5(currentlyIs: boolean) {
    if (currentlyIs) return true;          // always allow removing from top 5
    return top5Count < 5;                  // only add if < 5
  }

  function handleSave() {
    if (!look || !editName.trim()) return;

    // Build final gradients: keep remaining existing ones + new uploaded ones
    const finalGradients = [
      ...editGradients,
      ...makeGradients(newImgCount).slice(0, newImgCount),
    ];

    updateLook({
      ...look,
      name: editName.trim(),
      isTopFive: editTopFive,
      steps: editSteps.filter(Boolean),
      productsUsed: editProducts,
      gradients: finalGradients.length > 0 ? finalGradients : look.gradients,
    });

    setEditOpen(false);
    // Reset current slide if it's now out of range
    setCurrentImg(0);
  }

  // ── Not found ─────────────────────────────────────────────────────────────

  if (!look) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted text-lg">Look not found.</p>
          <button onClick={() => router.push('/looks')} className="text-accent hover:text-accent-light transition-colors text-sm">← Back to Gallery</button>
        </div>
      </div>
    );
  }

  const total = look.gradients.length;

  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <button onClick={() => router.push('/looks')} className="flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm mb-8">
          ← Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Carousel ── */}
          <div className="space-y-4">
            <div
              className="relative w-full aspect-3/4 rounded-2xl overflow-hidden cursor-pointer group"
              onMouseEnter={startRotation} onMouseLeave={stopRotation} onClick={openLightbox}
            >
              <div className="absolute inset-0 transition-all duration-700" style={{ background: look.gradients[currentImg] }} />
              {total > 1 && <>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImg((i) => (i - 1 + total) % total); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">‹</button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImg((i) => (i + 1) % total); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">›</button>
              </>}
              {total > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {look.gradients.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                      className={`h-2 rounded-full transition-all ${i === currentImg ? 'w-4 bg-white' : 'w-2 bg-white/50'}`} />
                  ))}
                </div>
              )}
            </div>

            {total > 1 && (
              <div className="flex gap-2">
                {look.gradients.map((g, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ background: g }} />
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl text-foreground">{look.name}</h1>
                {look.isTopFive && (
                  <span className="mt-2 inline-block text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">★ Top 5</span>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={openEdit}
                  className="text-sm px-4 py-2 rounded-lg bg-surface text-muted hover:text-foreground border border-primary/40 transition-colors">Edit</button>
                <button onClick={() => setConfirmOpen(true)}
                  className="text-sm px-4 py-2 rounded-lg bg-surface text-accent border border-accent/40 hover:bg-accent/10 transition-colors">Remove</button>
              </div>
            </div>

            {look.steps.length > 0 && (
              <div>
                <h2 className="text-lg text-foreground mb-3">Steps & Techniques</h2>
                <ol className="space-y-2">
                  {look.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary/30 text-foreground flex items-center justify-center text-xs">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {look.productsUsed.length > 0 && (
              <div>
                <h2 className="text-lg text-foreground mb-3">Products Used</h2>
                <div className="flex flex-wrap gap-2">
                  {look.productsUsed.map((p) => (
                    <span key={p} className="text-sm bg-surface border border-primary/30 text-muted px-3 py-1.5 rounded-lg">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {look.moodBoards.length > 0 && (
              <div>
                <h2 className="text-lg text-foreground mb-3">Mood Boards</h2>
                <div className="flex flex-wrap gap-2">
                  {look.moodBoards.map((mb) => (
                    <a key={mb} href="/moodboard" className="text-sm text-accent hover:text-accent-light underline underline-offset-2 transition-colors">{mb}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && <Lightbox gradients={look.gradients} startIndex={currentImg} onClose={() => setLightboxOpen(false)} />}

      {/* ── Edit Modal ── */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Look">
        <div className="space-y-5">

          {/* Name */}
          <div className="space-y-1">
            <label className="text-muted text-sm">Look Name</label>
            <input value={editName} onChange={(e) => setEditName(e.target.value)}
              placeholder="Look name" className={inputCls} />
          </div>

          {/* Current images — each removable */}
          <div className="space-y-2">
            <label className="text-muted text-sm">
              Current Images
              <span className="ml-2 text-muted/50 text-xs">({editGradients.length} slide{editGradients.length !== 1 ? 's' : ''})</span>
            </label>
            {editGradients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {editGradients.map((g, i) => (
                  <div key={i} className="relative group">
                    <div className="w-16 h-16 rounded-lg" style={{ background: g }} />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity leading-none"
                      aria-label="Remove image"
                    >✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted/50 text-xs">All images removed — add new ones below.</p>
            )}
          </div>

          {/* Add more images */}
          <div className="space-y-1">
            <label className="text-muted text-sm">
              Add More Images
              {newImgCount > 0 && <span className="text-accent ml-2">{newImgCount} selected</span>}
            </label>
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-accent transition-colors text-muted text-sm gap-1">
              <span className="text-xl">📷</span>
              <span>{newImgCount > 0 ? `${newImgCount} image${newImgCount > 1 ? 's' : ''} ready to add` : 'Click to upload'}</span>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setNewImgCount(e.target.files?.length ?? 0)} />
            </label>
          </div>

          {/* Top 5 toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between bg-bg rounded-lg px-4 py-3">
              <div>
                <span className="text-sm text-foreground">Top 5</span>
                {!editTopFive && !canMakeTop5(editTopFive) && (
                  <p className="text-muted/60 text-xs mt-0.5">Top 5 is full — remove another look first.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!editTopFive && !canMakeTop5(false)) return;
                  setEditTopFive((v) => !v);
                }}
                disabled={!editTopFive && !canMakeTop5(false)}
                className={`w-10 h-6 rounded-full transition-colors relative ${editTopFive ? 'bg-accent' : 'bg-primary/40'} disabled:opacity-40`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editTopFive ? 'left-5' : 'left-1'}`} />
              </button>
            </div>
            {look.isTopFive && !editTopFive && (
              <p className="text-muted/60 text-xs px-1">Removing from Top 5 frees up a slot for another look.</p>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <label className="text-muted text-sm">Steps & Techniques</label>
            {editSteps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <input value={step} onChange={(e) => updateStep(i, e.target.value)}
                  placeholder={`Step ${i + 1}`} className={`${inputCls} flex-1`} />
                {editSteps.length > 1 && (
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
              <input value={productInput} onChange={(e) => setProductInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitProduct(); } }}
                placeholder="Add product name and brand"
                className={`${inputCls} flex-1`} />
              <button type="button" onClick={commitProduct}
                className="shrink-0 bg-primary text-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition-colors">Add</button>
            </div>
            {editProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {editProducts.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 text-xs bg-accent/15 border border-accent/40 text-accent pl-3 pr-2 py-1.5 rounded-full">
                    {p}
                    <button type="button" onClick={() => removeProduct(p)}
                      className="text-accent/60 hover:text-accent transition-colors leading-none">✕</button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted/50 text-xs">No products — type above and press Add or Enter.</p>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!editName.trim()}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* ── Remove confirm ── */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Remove Look">
        <div className="space-y-6">
          <p className="text-muted text-sm">
            Are you sure you want to remove <span className="text-foreground">{look.name}</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmOpen(false)}
              className="flex-1 py-2.5 rounded-lg bg-surface text-muted hover:text-foreground border border-primary/40 transition-colors text-sm">Cancel</button>
            <button onClick={() => { removeLook(look.id); router.push('/looks'); }}
              className="flex-1 py-2.5 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity text-sm">Remove</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
