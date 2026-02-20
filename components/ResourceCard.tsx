"use client";

import Image from "next/image";
import { useState } from "react";

interface Resource {
  id: number;
  title: string;
  url: string;
  content: string;
  image: string;
  category: string;
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Truncar texto a 90 caracteres
  const truncatedContent =
    resource.content.length > 100 ? resource.content.substring(0, 90) + "..." : resource.content;
  const trunctatedTitle =
    resource.title.length > 45 ? resource.title.substring(0, 45) + "..." : resource.title;

  return (
    <article>
      <div className="gap-4 justify-items-center text-center p-4 bg-[#1e293b] rounded-3xl">
        <Image
          src={resource.image}
          alt={resource.title}
          width={300}
          height={200}
          className="hover:scale-110 transition-transform duration-300 rounded-lg cursor-pointer"
          onClick={openModal}
        />
        <h2 className="font-bold mt-2">{trunctatedTitle}</h2>
        <p className="text-sm text-gray-300">{truncatedContent}</p>
        <span className="text-xs text-blue-400">{resource.category}</span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-[3px] rounded-3xl flex items-center justify-center z-50 p-4 "
          onClick={closeModal}
        >
          <div
            className="rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 h-full bg-clip-padding backdrop-filter bg-opacity-10 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between text-center mb-4">
              <h2 className="text-2xl font-bold ">{resource.title}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>
            <Image
              src={resource.image}
              alt={resource.title}
              width={800}
              height={400}
              className="rounded-lg mb-4 w-full aspect-video"
            />
            <p className="text-gray-300 mb-4 ">{resource.content}</p>
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
      )}
    </article>
  );
}
