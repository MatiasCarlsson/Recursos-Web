"use client";

import Image from "next/image";
import { useState } from "react";
import { Resource } from "@/types/resource";
import { truncateText } from "@/lib/utils";
import ResourceModal from "./ResourceModal";
import { formatTextFitstUpperCase } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  variant?: "default" | "compact";
  prioritizeImage?: boolean;
}

const styles = {
  insetShadow:
    "absolute inset-0 inset-shadow-sm inset-shadow-accent rounded-2xl pointer-events-none",
  scaleImage:
    "block w-full aspect-video object-cover hover:scale-110 transition-transform duration-500 rounded-2xl cursor-pointer active:scale-99 select-none",
  linkResource:
    "italic flex hover:scale-105 text-end px-3 py-1 transition-transform duration-300 text-buttonColor border-2 border-buttonColor rounded-lg active:scale-95 justify-items-center select-none",
};

export default function ResourceCard({
  resource,
  variant = "default",
  prioritizeImage = false,
}: ResourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fallbackImageSrc = `https://dummyimage.com/1200x675/0f172a/e2e8f0.png?text=${encodeURIComponent(
    resource.title || "Recurso",
  )}`;
  const [imageSrc, setImageSrc] = useState(resource.image?.trim() || fallbackImageSrc);
  const isCompact = variant === "compact";

  const truncatedContent = truncateText(resource.content, isCompact ? 58 : 90);
  const truncatedTitle = truncateText(resource.title, isCompact ? 34 : 45);

  return (
    <>
      <article
        className={`flex flex-col bg-cardBackground rounded-3xl mix-blend-darker ${isCompact ? "gap-3" : "gap-4"}`}
      >
        <div className="w-full">
          <span className="relative block rounded-2xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={resource.title}
              width={400}
              height={225}
              // unoptimized to allow for dynamic image loading and error handling

              priority={prioritizeImage}
              loading={prioritizeImage ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.scaleImage}
              onClick={() => setIsModalOpen(true)}
              onError={() => {
                setImageSrc(fallbackImageSrc);
              }}
            />

            <span className={styles.insetShadow}></span>

            <span
              className={`absolute select-none right-3 bottom-3 font-bold border border-white/40 rounded-lg w-fit px-2 py-1 backdrop-blur-sm bg-cardBackground/40 text-violet-200 z-20 ${isCompact ? "text-xs" : "text-sm"}`}
            >
              {formatTextFitstUpperCase(resource.category)}
            </span>
          </span>
        </div>

        <h2 className={`font-bold mt-1 text-center ${isCompact ? "text-sm" : "text-base"}`}>
          {formatTextFitstUpperCase(truncatedTitle)}
        </h2>

        <div
          className={`flex mx-3 items-center justify-between ${isCompact ? "text-xs pb-3" : "text-sm pb-4 -mt-1"}`}
        >
          <p className="">{truncatedContent}</p>

          <span>
            <a
              href={`${resource.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkResource}
            >
              Ir
            </a>
          </span>
        </div>
      </article>

      <ResourceModal
        resource={resource}
        imageSrc={imageSrc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
