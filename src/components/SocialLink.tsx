"use client";

import { useState, type MouseEventHandler } from "react";
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
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

function SocialMedia(props: SocialMediaProps) {
  const [isHovered, setIsHovered] = useState(false);
  const typedText = useTypingEffect(props.mediaName, 50, isHovered);
  const target = props.target ?? "_blank";
  const rel = props.rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <Link
      href={props.href}
      target={target}
      rel={rel}
      className={props.className}
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="shrink-0 flex items-center">
        <Image
          src={props.iconSrc}
          alt={props.altText}
          width={props.width || 24}
          height={props.height || 24}
          className="transition-all duration-500 group-hover:brightness-0 group-hover:invert w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
        />
      </div>
      <span className={`${props.styleMediaName ?? "hidden sm:inline-block ml-2"}`}>
        {typedText}
      </span>
    </Link>
  );
}

export default SocialMedia;
