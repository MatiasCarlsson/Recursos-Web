"use client";

import Image from "next/image";
import { Resource } from "@/types/resource";

interface ResourceModalProps {
  resource: Resource;
  imageSrc?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceModal({ resource, imageSrc, isOpen, onClose }: ResourceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-[3px] flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 border border-white/15 bg-cardBackground/95 backdrop-blur-md shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold flex-1">{resource.title}</h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="text-gray-400 hover:text-violet-600 text-xl ml-4 items-center cursor-pointer transition-transform duration-600 ease-out hover:rotate-280 hover:scale-110 p-0 leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <Image
            src={imageSrc ?? resource.image}
            alt={resource.title}
            width={640}
            height={360}
            sizes="(max-width: 768px) 100vw, 360px"
            quality={90}
            loading="eager"
            priority
            className="rounded-lg w-full sm:w-[440px] aspect-video object-cover"
          />

          <div className="bg-cardBackground/70 p-4 rounded-lg flex-1 min-w-[260px] self-start">
            <p className="text-sm leading-relaxed">{resource.content}</p>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-buttonColor/70 bg-buttonColor/20 px-4 py-2 font-semibold text-textPrimary transition-all hover:bg-buttonColor/35 hover:border-buttonColor hover:scale-[1.02]"
          >
            Ver recurso
          </a>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex flex-wrap gap-2">
            {resource.tags.length > 0 ? (
              resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-200"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Sin etiquetas</span>
            )}
          </div>

          <span className="text-xs font-medium rounded-full border border-indigo-400/40 bg-indigo-500/15 px-2 py-1 text-indigo-200">
            {resource.category}
          </span>
        </div>
      </div>
    </div>
  );
}
