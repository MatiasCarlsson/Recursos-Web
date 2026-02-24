"use client";

import Image from "next/image";
import { Resource } from "@/types/resource";

interface ResourceModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceModal({ resource, isOpen, onClose }: ResourceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-[3px] flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 bg-clip-padding backdrop-filter bg-opacity-10 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold flex-1">{resource.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl ml-4">
            ×
          </button>
        </div>

        <Image
          src={resource.image}
          alt={resource.title}
          width={800}
          height={400}
          className="rounded-lg mb-4 w-full aspect-video object-cover"
        />

        <p className="text-gray-300 mb-4">{resource.content}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-400">{resource.category}</span>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Ver recurso
          </a>
        </div>
      </div>
    </div>
  );
}
