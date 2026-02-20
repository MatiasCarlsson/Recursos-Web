"use client";

import Image from "next/image";
import { useState } from "react";
import { Resource } from "@/types/resource";
import { truncateText } from "@/lib/utils";
import ResourceModal from "./ResourceModal";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const truncatedContent = truncateText(resource.content, 90);
  const truncatedTitle = truncateText(resource.title, 45);

  return (
    <>
      <article className="gap-4 justify-items-center text-center p-4 bg-[#1e293b] rounded-3xl">
        <Image
          src={resource.image}
          alt={resource.title}
          width={300}
          height={200}
          className="hover:scale-110 transition-transform duration-300 rounded-lg cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <h2 className="font-bold mt-2">{truncatedTitle}</h2>
        <p className="text-sm text-gray-300">{truncatedContent}</p>
        <span className="text-xs text-blue-400">{resource.category}</span>
      </article>

      <ResourceModal
        resource={resource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
