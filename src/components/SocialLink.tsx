"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTypingEffect } from "@/components/Hooks/useTypingEffect";

interface SocialMediaProps {
  href: string;
  iconSrc: string;
  altText: string;
  width?: number;
  height?: number;
  mediaName: string;
  className?: string;
  styleMediaName?: string;
}

function SocialMedia(props: SocialMediaProps) {
  const [isHovered, setIsHovered] = useState(false);
  const typedText = useTypingEffect(props.mediaName, 50, isHovered);

  return (
    <Link
      href={props.href}
      target="_blank"
      className={props.className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="shrink-0 flex justify-items-center">
        <Image
          src={props.iconSrc}
          alt={props.altText}
          width={props.width || 24}
          height={props.height || 24}
          // Tamaños responsive del icono usando clases de Tailwind
          className="transition-all duration-500 group-hover:brightness-0 group-hover:invert w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
        />
      </div>
      <span className={`${props.styleMediaName}`}>{typedText}</span>
    </Link>
  );
}

export default SocialMedia;
