'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { useUser } from '@/contexts/UserContext';

// ---------------------------------------------------------------------------

const inputCls =
  'w-full bg-bg border border-primary rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm';

const SKIN_TYPES   = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const SKIN_TONES   = ['Fair', 'Light', 'Light Medium', 'Medium', 'Medium Tan', 'Tan', 'Deep Tan', 'Deep', 'Rich', 'Ebony'];
const UNDERTONES   = ['Cool', 'Warm', 'Neutral', 'Olive'];
const LOOK_OPTIONS = ['Full Glam', 'Office Going', 'Natural', 'Bridal', 'Editorial', 'Smoky', 'Clean Girl', 'Bold Lip'];

const HERO_GRADIENTS = [
  'linear-gradient(135deg, #CDB4DB 0%, #FFAFCC 30%, #FFC8DD 60%, #BDE0FE 80%, #A2D2FF 100%)',
  'linear-gradient(135deg, #FFAFCC 0%, #FFC8DD 50%, #BDE0FE 100%)',
  'linear-gradient(135deg, #BDE0FE 0%, #A2D2FF 50%, #CDB4DB 100%)',
  'linear-gradient(135deg, #FFC8DD 0%, #FFAFCC 50%, #A2D2FF 100%)',
  'linear-gradient(135deg, #A2D2FF 0%, #BDE0FE 50%, #CDB4DB 100%)',
  'linear-gradient(135deg, #CDB4DB 0%, #BDE0FE 50%, #FFAFCC 100%)',
];

// ---------------------------------------------------------------------------
// Section card
// ---------------------------------------------------------------------------

function Section({
  title, onEdit, children,
}: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg text-foreground">{title}</h2>
        <button onClick={onEdit}
          className="text-sm px-4 py-1.5 rounded-lg border border-primary/40 text-muted hover:text-foreground transition-colors">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PortfolioPage() {
  const { profile, updateProfile } = useUser();

  type ModalKey = 'hero' | 'skinType' | 'complexion' | 'undertone' | 'brands' | 'looks' | null;
  const [open, setOpen] = useState<ModalKey>(null);

  // Temp state
  const [tmpSkinType,   setTmpSkinType]   = useState('');
  const [tmpComplexion, setTmpComplexion] = useState('');
  const [tmpUndertone,  setTmpUndertone]  = useState('');
  const [tmpBrandInput, setTmpBrandInput] = useState('');
  const [tmpBrands,     setTmpBrands]     = useState<string[]>([]);
  const [tmpLooks,      setTmpLooks]      = useState<string[]>([]);
  const [tmpHero,       setTmpHero]       = useState('');

  function openModal(key: ModalKey) {
    setOpen(key);
    if (key === 'skinType')   setTmpSkinType(profile.skinType);
    if (key === 'complexion') setTmpComplexion(profile.complexion);
    if (key === 'undertone')  setTmpUndertone(profile.undertone);
    if (key === 'brands')     { setTmpBrands([...profile.preferredBrands]); setTmpBrandInput(''); }
    if (key === 'looks')      setTmpLooks([...profile.preferredLooks]);
    if (key === 'hero')       setTmpHero(profile.heroGradient);
  }
  function closeModal() { setOpen(null); }

  // Brand helpers
  function commitBrand() {
    const t = tmpBrandInput.trim();
    if (!t || tmpBrands.includes(t)) return;
    setTmpBrands((b) => [...b, t]);
    setTmpBrandInput('');
  }
  function toggleLook(l: string) {
    setTmpLooks((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  }

  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 space-y-6">

        <h1 className="text-3xl text-foreground">Beauty Portfolio</h1>

        {/* Hero */}
        <div
          className="w-full h-48 sm:h-64 rounded-3xl relative overflow-hidden"
          style={{ background: profile.heroGradient }}
        >
          <button
            onClick={() => openModal('hero')}
            className="absolute top-4 right-4 text-sm px-3 py-1.5 rounded-lg bg-black/40 text-white hover:bg-black/60 transition-colors"
          >Change Hero</button>
        </div>

        {/* Skin Type */}
        <Section title="Skin Type" onEdit={() => openModal('skinType')}>
          <span className="inline-block bg-accent/20 text-accent text-sm px-3 py-1 rounded-full">{profile.skinType}</span>
        </Section>

        {/* Skin Tone (was Complexion) */}
        <Section title="Skin Tone" onEdit={() => openModal('complexion')}>
          <span className="inline-block bg-primary/30 text-foreground text-sm px-3 py-1 rounded-full">{profile.complexion}</span>
        </Section>

        {/* Undertone */}
        <Section title="Undertone" onEdit={() => openModal('undertone')}>
          <span className="inline-block bg-secondary/30 text-foreground text-sm px-3 py-1 rounded-full">{profile.undertone}</span>
        </Section>

        {/* Preferred Brands */}
        <Section title="Preferred Brands" onEdit={() => openModal('brands')}>
          {profile.preferredBrands.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.preferredBrands.map((b) => (
                <span key={b} className="text-sm bg-surface border border-primary/30 text-muted px-3 py-1.5 rounded-lg">{b}</span>
              ))}
            </div>
          ) : (
            <p className="text-muted/50 text-sm">No preferred brands set.</p>
          )}
        </Section>

        {/* Preferred Looks */}
        <Section title="Preferred Looks" onEdit={() => openModal('looks')}>
          {profile.preferredLooks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.preferredLooks.map((l) => (
                <span key={l} className="text-sm bg-accent/15 border border-accent/40 text-accent px-3 py-1.5 rounded-full">{l}</span>
              ))}
            </div>
          ) : (
            <p className="text-muted/50 text-sm">No preferred looks set.</p>
          )}
        </Section>

        {/* Products link */}
        <div className="bg-surface rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg text-foreground">My Products</h2>
            <p className="text-muted/60 text-sm mt-0.5">View and manage your product collection.</p>
          </div>
          <Link href="/products"
            className="text-sm px-4 py-2 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity shrink-0 ml-4">
            View →
          </Link>
        </div>

      </div>

      {/* ── Hero Modal ── */}
      <Modal open={open === 'hero'} onClose={closeModal} title="Change Hero">
        <div className="space-y-4">
          <p className="text-muted text-sm">Choose a gradient or upload your own image.</p>
          <div className="grid grid-cols-3 gap-3">
            {HERO_GRADIENTS.map((g) => (
              <button key={g} onClick={() => setTmpHero(g)}
                className={`h-16 rounded-xl border-2 transition-all ${tmpHero === g ? 'border-accent scale-[1.04]' : 'border-transparent hover:border-accent/40'}`}
                style={{ background: g }} />
            ))}
          </div>
          <label className="flex items-center gap-3 bg-bg border border-primary/40 rounded-xl px-4 py-3 cursor-pointer hover:border-accent transition-colors text-muted text-sm">
            <span className="text-xl">📷</span>
            <span>Upload custom hero image</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <button onClick={() => { updateProfile({ heroGradient: tmpHero }); closeModal(); }}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Skin Type Modal ── */}
      <Modal open={open === 'skinType'} onClose={closeModal} title="Edit Skin Type">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {SKIN_TYPES.map((st) => (
              <button key={st} onClick={() => setTmpSkinType(st)}
                className={`py-2.5 px-4 rounded-lg text-sm border text-left transition-colors ${tmpSkinType === st ? 'bg-accent/20 border-accent text-accent' : 'bg-bg border-primary/40 text-muted hover:text-foreground'}`}>
                {st}
              </button>
            ))}
          </div>
          <button onClick={() => { updateProfile({ skinType: tmpSkinType }); closeModal(); }}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Skin Tone Modal ── */}
      <Modal open={open === 'complexion'} onClose={closeModal} title="Edit Skin Tone">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {SKIN_TONES.map((t) => (
              <button key={t} onClick={() => setTmpComplexion(t)}
                className={`py-2.5 px-4 rounded-lg text-sm border text-left transition-colors ${tmpComplexion === t ? 'bg-accent/20 border-accent text-accent' : 'bg-bg border-primary/40 text-muted hover:text-foreground'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => { updateProfile({ complexion: tmpComplexion }); closeModal(); }}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Undertone Modal ── */}
      <Modal open={open === 'undertone'} onClose={closeModal} title="Edit Undertone">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {UNDERTONES.map((u) => (
              <button key={u} onClick={() => setTmpUndertone(u)}
                className={`py-2.5 px-4 rounded-lg text-sm border text-left transition-colors ${tmpUndertone === u ? 'bg-accent/20 border-accent text-accent' : 'bg-bg border-primary/40 text-muted hover:text-foreground'}`}>
                {u}
              </button>
            ))}
          </div>
          <button onClick={() => { updateProfile({ undertone: tmpUndertone }); closeModal(); }}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Brands Modal ── */}
      <Modal open={open === 'brands'} onClose={closeModal} title="Edit Preferred Brands">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input value={tmpBrandInput} onChange={(e) => setTmpBrandInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitBrand(); } }}
              placeholder="Add brand name" className={`${inputCls} flex-1`} />
            <button onClick={commitBrand}
              className="shrink-0 bg-primary text-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition-colors">Add</button>
          </div>
          {tmpBrands.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tmpBrands.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs bg-accent/15 border border-accent/40 text-accent pl-3 pr-2 py-1.5 rounded-full">
                  {b}
                  <button onClick={() => setTmpBrands((prev) => prev.filter((x) => x !== b))}
                    className="text-accent/60 hover:text-accent leading-none">✕</button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted/50 text-xs">No brands yet.</p>
          )}
          <button onClick={() => { updateProfile({ preferredBrands: tmpBrands }); closeModal(); }}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Preferred Looks Modal ── */}
      <Modal open={open === 'looks'} onClose={closeModal} title="Edit Preferred Looks">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {LOOK_OPTIONS.map((l) => (
              <button key={l} onClick={() => toggleLook(l)}
                className={`py-2.5 rounded-lg text-sm border transition-colors ${tmpLooks.includes(l) ? 'bg-accent/20 border-accent text-accent' : 'bg-bg border-primary/40 text-muted hover:text-foreground'}`}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => { updateProfile({ preferredLooks: tmpLooks }); closeModal(); }}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all">
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
