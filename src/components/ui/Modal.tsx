"use client";

import { useEffect } from "react";

type ModalProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorPosition?: {
    top: number;
    left: number;
  };
};

export default function Modal({ title, open, onClose, children, anchorPosition }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const anchored = Boolean(anchorPosition);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />

      {anchored ? (
        <div
          className="absolute w-[min(56rem,calc(100vw-1rem))] max-h-[calc(100vh-1rem)] overflow-y-auto rounded-2xl bg-cardBackground p-6 shadow-xl"
          style={{ top: anchorPosition?.top, left: anchorPosition?.left }}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="rounded-md border border-border/60 px-2 py-1 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">{children}</div>
        </div>
      ) : (
        <div className="flex min-h-full items-center justify-center p-2">
          <div className="relative w-full max-w-3xl rounded-2xl bg-cardBackground p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className="rounded-md border border-border/60 px-2 py-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
