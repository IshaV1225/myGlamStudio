'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { useMoodBoards, makeGradients, type MoodBoard } from '@/contexts/MoodBoardContext';

// ---------------------------------------------------------------------------

const inputCls =
  'w-full bg-bg border border-primary rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm';

// ---------------------------------------------------------------------------
// Board detail popup
// ---------------------------------------------------------------------------

function ImageLightbox({
  gradients, index, onClose,
}: { gradients: string[]; index: number; onClose: () => void }) {
  const [idx, setIdx] = useState(index);
  const total = gradients.length;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  setIdx((i) => (i - 1 + total) % total);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % total);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, total]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none z-10">✕</button>
      {total > 1 && (
        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">{idx + 1} / {total}</span>
      )}

      {total > 1 && <>
        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + total) % total); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center z-10"
        >‹</button>
        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % total); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center z-10"
        >›</button>
      </>}

      <div
        className="w-72 sm:w-96 aspect-square rounded-3xl transition-all duration-500 shadow-2xl"
        style={{ background: gradients[idx] }}
        onClick={(e) => e.stopPropagation()}
      />

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

function BoardViewer({
  board, onClose, onAddImages, onSavePinterest,
}: {
  board: MoodBoard;
  onClose: () => void;
  onAddImages: (count: number) => void;
  onSavePinterest: (url: string) => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [addingImages, setAddingImages]   = useState(false);
  const [addTab, setAddTab]               = useState<'upload' | 'pinterest'>('upload');
  const [newCount, setNewCount]           = useState(0);
  const [pinUrl, setPinUrl]               = useState(board.pinterestBoardUrl ?? '');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && lightboxIndex === null) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [onClose, lightboxIndex]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="relative bg-surface rounded-3xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary/30">
            <h2 className="text-xl text-foreground">{board.name}</h2>
            <button onClick={onClose} className="text-muted hover:text-foreground text-2xl leading-none transition-colors">✕</button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6">
            {/* Image grid — each tile clickable */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {board.gradients.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-square rounded-2xl overflow-hidden hover:scale-[1.03] hover:ring-2 hover:ring-accent transition-all duration-200 will-change-transform"
                  style={{ background: g }}
                />
              ))}
            </div>

            {/* Add images to this board */}
            {addingImages ? (
              <div className="bg-bg rounded-2xl p-4 space-y-3">
                {/* Tabs */}
                <div className="flex gap-1 bg-surface rounded-lg p-1">
                  {(['upload', 'pinterest'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setAddTab(tab); setNewCount(0); setPinUrl(board.pinterestBoardUrl ?? ''); }}
                      className={`flex-1 py-1.5 rounded-md text-sm transition-colors ${addTab === tab ? 'bg-primary text-foreground' : 'text-muted hover:text-foreground'}`}
                    >
                      {tab === 'upload' ? '📁 Upload' : '📌 Pinterest'}
                    </button>
                  ))}
                </div>

                {addTab === 'upload' ? (
                  <>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-accent transition-colors text-muted text-sm gap-1">
                      <span className="text-xl">🖼️</span>
                      <span>{newCount > 0 ? `${newCount} image${newCount > 1 ? 's' : ''} selected` : 'Click to select images'}</span>
                      <input type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => setNewCount(e.target.files?.length ?? 0)} />
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => { setAddingImages(false); setNewCount(0); }}
                        className="flex-1 py-2 rounded-lg bg-surface text-muted hover:text-foreground border border-primary/40 transition-colors text-sm">Cancel</button>
                      <button
                        onClick={() => { if (newCount > 0) onAddImages(newCount); setAddingImages(false); setNewCount(0); }}
                        disabled={newCount === 0}
                        className="flex-1 py-2 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity text-sm disabled:opacity-40"
                      >Add {newCount > 0 ? `${newCount} Image${newCount > 1 ? 's' : ''}` : 'Images'}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <input
                        value={pinUrl}
                        onChange={(e) => setPinUrl(e.target.value)}
                        placeholder="https://pinterest.com/yourboard/..."
                        className="w-full bg-surface border border-primary rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm"
                      />
                      <p className="text-muted/50 text-xs">Pinterest API sync is coming soon — your board URL will be saved for when it launches.</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setAddingImages(false); setPinUrl(board.pinterestBoardUrl ?? ''); }}
                        className="flex-1 py-2 rounded-lg bg-surface text-muted hover:text-foreground border border-primary/40 transition-colors text-sm">Cancel</button>
                      <button
                        onClick={() => { onSavePinterest(pinUrl.trim()); setAddingImages(false); }}
                        disabled={!pinUrl.trim()}
                        className="flex-1 py-2 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity text-sm disabled:opacity-40"
                      >Save URL</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => { setAddingImages(true); setAddTab('upload'); }}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-primary/40 text-muted hover:border-accent hover:text-accent transition-colors text-sm"
              >+ Add Images</button>
            )}

            {/* AI description */}
            {board.aiDescription ? (
              <div className="bg-bg rounded-2xl px-5 py-4 space-y-1">
                <p className="text-xs text-accent uppercase tracking-widest">AI Description</p>
                <p className="text-muted text-sm leading-relaxed">{board.aiDescription}</p>
              </div>
            ) : (
              <div className="bg-bg rounded-2xl px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="text-foreground text-sm">AI Description</p>
                  <p className="text-muted/60 text-xs">AI-powered descriptions coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          gradients={board.gradients}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MoodBoardPage() {
  const { boards, addBoard, updateBoard, removeBoard } = useMoodBoards();

  const [selectedBoard, setSelectedBoard] = useState<MoodBoard | null>(null);
  const [addOpen, setAddOpen]             = useState(false);
  const [confirmId, setConfirmId]         = useState<string | null>(null);

  // Add board form
  const [newName, setNewName]         = useState('');
  const [imageCount, setImageCount]   = useState(0);

  function resetForm() { setNewName(''); setImageCount(0); }

  function handleAdd(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!newName.trim()) return;

    addBoard({
      id: Date.now().toString(),
      name: newName.trim(),
      gradients: makeGradients(imageCount || 3),
    });
    resetForm();
    setAddOpen(false);
  }

  const boardToRemove = boards.find((b) => b.id === confirmId);

  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h1 className="text-3xl text-foreground">Mood Boards</h1>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-accent text-white px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            + Upload Mood Board
          </button>
        </div>

        {/* Grid */}
        {boards.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-4xl">🎨</p>
            <p className="text-muted">No mood boards yet — create your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <div
                key={board.id}
                className="group relative bg-surface rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-200 will-change-transform"
                onClick={() => setSelectedBoard(board)}
              >
                {/* Cover — 2×2 mini grid preview */}
                <div className="grid grid-cols-2 gap-0.5 aspect-square">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-full"
                      style={{ background: board.gradients[i % board.gradients.length] }}
                    />
                  ))}
                </div>

                {/* Name + photo count */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <p className="text-foreground text-sm font-medium truncate">{board.name}</p>
                  <span className="text-muted/60 text-xs shrink-0 ml-2">{board.gradients.length} photos</span>
                </div>

                {/* AI badge */}
                {board.aiDescription && (
                  <span className="absolute top-2 left-2 text-xs bg-accent/80 text-white px-2 py-0.5 rounded-full">✨ AI</span>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmId(board.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
                  aria-label="Remove board"
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Board viewer */}
      {selectedBoard && (
        <BoardViewer
          board={selectedBoard}
          onClose={() => setSelectedBoard(null)}
          onAddImages={(count) => {
            const newGradients = makeGradients(selectedBoard.gradients.length + count).slice(selectedBoard.gradients.length);
            const updated = { ...selectedBoard, gradients: [...selectedBoard.gradients, ...newGradients] };
            updateBoard(updated);
            setSelectedBoard(updated);
          }}
          onSavePinterest={(url) => {
            const updated = { ...selectedBoard, pinterestBoardUrl: url };
            updateBoard(updated);
            setSelectedBoard(updated);
          }}
        />
      )}

      {/* Add Board Modal */}
      <Modal open={addOpen} onClose={() => { resetForm(); setAddOpen(false); }} title="Upload Mood Board">
        <form onSubmit={handleAdd} className="space-y-5">

          <div className="space-y-1">
            <label className="text-muted text-sm">Board Name *</label>
            <input
              required value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Espresso, Icy, Tropical"
              className={inputCls}
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted text-sm">
              Upload Images
              {imageCount > 0 && <span className="text-accent ml-2">{imageCount} selected</span>}
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-accent transition-colors text-muted text-sm gap-1">
              <span className="text-2xl">🖼️</span>
              <span>{imageCount > 0 ? `${imageCount} image${imageCount > 1 ? 's' : ''} — click to change` : 'Click to upload images'}</span>
              <input
                type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setImageCount(e.target.files?.length ?? 0)}
              />
            </label>
            <p className="text-muted/50 text-xs">Pinterest import coming soon.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 active:scale-95 transition-all"
          >
            Save Mood Board
          </button>
        </form>
      </Modal>

      {/* Remove confirm */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Remove Mood Board">
        <div className="space-y-6">
          <p className="text-muted text-sm">
            Are you sure you want to remove <span className="text-foreground">{boardToRemove?.name}</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmId(null)}
              className="flex-1 py-2.5 rounded-lg bg-surface text-muted hover:text-foreground border border-primary/40 transition-colors text-sm"
            >Cancel</button>
            <button
              onClick={() => { if (confirmId) removeBoard(confirmId); setConfirmId(null); }}
              className="flex-1 py-2.5 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity text-sm"
            >Remove</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
