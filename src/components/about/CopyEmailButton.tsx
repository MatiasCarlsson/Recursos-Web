"use client";

import { useState } from "react";
import Image from "next/image";

const EMAIL = "matiascarlsson1@gmail.com";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Clipboard error", e);
    }
  };

  return (
    /* Agregamos 'relative' para que el texto absoluto se posicione respecto a este botón */
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className="relative flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-primaryColor/30 transition-colors"
    >
      <span className="inline-flex items-center justify-center size-7 text-buttonColor" aria-hidden> 
        {/* Aquí mantienes tu animación 'animate-pop' si la configuraste en v4 */}
        <Image src="/clipboard.svg" alt="Copy email" width={32} height={32} className="animate-pop" />
      </span>

      {/* TOOLTIP ABSOLUTO: Aparece arriba del botón */}
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono px-2 py-1 rounded shadow-md animate-in fade-in slide-in-from-bottom-1 text-textSecondary">
          ¡Copiado!
        </span>
      )}
    </button>
  );
}