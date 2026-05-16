"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "resources-web-startup-notice-dismissed";

export default function StartupNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if dismissed in sessionStorage
    const dismissed = window.sessionStorage.getItem(STORAGE_KEY) === "true";

    if (!dismissed) {
      // Adding a small delay helps to trigger CSS animations when component mounts
      const timer = setTimeout(() => setOpen(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleClose() {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed right-4 top-24 z-50 w-[min(24rem,calc(100vw-2rem))] animate-in fade-in slide-in-from-top-4 duration-500 rounded-2xl border border-red-500/40 bg-[#1e1e1e]/95 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-red-500 animate-pulse shadow-[0_0_0_4px_rgba(239,68,68,0.2)]" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Aviso del proyecto</p>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-300">
            Este proyecto está desplegado utilizando servicios con capa gratuita. Es posible que las
            respuestas tarden unos segundos más de lo normal en cargar la primera vez.
          </p>
        </div>

        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={handleClose}
          className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-400 transition hover:border-red-400 hover:bg-red-500/20 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
