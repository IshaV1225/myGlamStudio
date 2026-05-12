'use client';

/**
 * components/Modal.tsx — Reusable popup/modal shell.
 *
 * WHY A SHARED MODAL COMPONENT?
 * The app has ~8 different modals (Add Look, Add Product, Edit Profile, etc.).
 * Without this, each one would repeat the same backdrop, close button, scroll
 * lock, and Escape key logic. This component handles all of that once.
 * Each usage just passes its own content as `children`.
 *
 * KEY BEHAVIOURS:
 *
 * 1. BODY SCROLL LOCK — when a modal is open, the page behind it shouldn't
 *    scroll. We set document.body.style.overflow = 'hidden' while open.
 *    The cleanup function (returned from useEffect) restores it when the
 *    modal closes or the component unmounts.
 *
 * 2. ESCAPE KEY — standard UX: pressing Escape should close any modal.
 *    We add a keydown listener when the modal opens and remove it on close.
 *    Always removing listeners you add is critical — forgetting to do this
 *    causes memory leaks and duplicate events.
 *
 * 3. BACKDROP CLICK — clicking the dark overlay behind the modal closes it.
 *    But clicking *inside* the modal card shouldn't. We achieve this with
 *    e.stopPropagation() on the inner card — it stops the click event from
 *    bubbling up to the backdrop's onClick handler.
 *
 * 4. CONDITIONAL RENDER — `if (!open) return null` means the modal's DOM
 *    doesn't exist at all when closed. This is better than hiding with CSS
 *    because hidden elements can still trap keyboard focus and be read by
 *    screen readers.
 */

import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // whatever content the caller wants inside the modal
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  // Scroll lock: prevent the page behind from scrolling while modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else      document.body.style.overflow = '';
    // Cleanup: always restore scroll when this effect re-runs or unmounts
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key: close the modal when the user presses Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    // Cleanup: remove the listener when modal closes (prevents duplicate listeners)
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Don't render anything into the DOM when closed
  if (!open) return null;

  return (
    // Full-screen overlay — clicking it closes the modal
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Semi-transparent dark backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal card — stopPropagation prevents backdrop click from closing when clicking inside */}
      <div
        className="relative z-10 bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row: title + close button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-foreground text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Slot for any content the caller passes in */}
        {children}
      </div>
    </div>
  );
}
