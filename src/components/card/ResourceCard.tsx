"use client";

import Image from "next/image";
import { useState } from "react";
import { Resource } from "@/types/resource";
import { truncateText } from "@/lib/utils";
import ResourceModal from "./ResourceModal";
import { formatTextFitstUpperCase } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const truncatedContent = truncateText(resource.content, 90);
  const truncatedTitle = truncateText(resource.title, 45);

  return (
    <>
      <article className="flex flex-col bg-cardBackground rounded-3xl gap-4">
        <div className="w-full flex flex-col justify-items-end">
          <span className="relative block rounded-2xl overflow-hidden">
            <Image
              src={resource.image}
              alt={resource.title}
              width={400}
              height={400}
              style={{
                width: "auto",
                height: "auto",
                objectFit: "cover",
              }}
              className="items-center hover:scale-110 transition-transform duration-500 rounded-2xl cursor-pointer active:scale-99 "
              onClick={() => setIsModalOpen(true)}
            />

            <span className="absolute inset-0 inset-shadow-sm inset-shadow-accent rounded-2xl pointer-events-none"></span>
          </span>
          <p className="font-bold text-sm border z-20 -mt-10 mx-5 flex ml-auto rounded-lg w-fit p-1 items-end">
            {formatTextFitstUpperCase(resource.category)}
          </p>
        </div>
        <h2 className="font-bold mt-1 text-center">{formatTextFitstUpperCase(truncatedTitle)}</h2>
        <div className="flex text-sm mx-3 items-center pb-4 -mt-1">
          <p className="">{truncatedContent}</p>
          <span>
            <a
              href={`${resource.url}`}
              target="_blank"
              className="italic flex hover:scale-105 text-end px-3 py-1 transition-transform duration-300 text-buttonColor border-2 border-buttonColor rounded-lg active:scale-95"
            >
              Ir
            </a>
          </span>

          {/* 
            // TODO
            1. Agregar parrafo con las etiquetas puestas del recurso abajo del contenido, con un estilo de fondo y borde diferente al de la categoria, y con un margen entre ambos parrafos
           */}
        </div>
      </article>

      <ResourceModal
        resource={resource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
