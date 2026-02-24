"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "@/styles/menuToggle.css";

const navigationStyles = {
  linksLi: "w-full sm:w-auto",
  link: "block w-full italic p-2 sm:px-3 sm:py-2 cursor-pointer text-sm sm:text-base md:text-lg lg:text-xl text-center",
  mobileLinksContainer:
    "absolute top-full left-0 w-full bg-[#0b0f19] border-t border-gray-800 shadow-2xl sm:hidden flex flex-col items-center py-4 z-50",
};

function MenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

  // Cierra el menú cuando la pantalla es mayor a 640px (breakpoint sm)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Links Desktop */}
      <ul className="hidden sm:flex flex-1 justify-center lg:justify-center gap-8 mr-7.25 font-bold whitespace-nowrap linksMenu">
        <li className={navigationStyles.linksLi}>
          <Link href="/" className={navigationStyles.link}>
            Inicio
          </Link>
        </li>
        <li className={navigationStyles.linksLi}>
          <Link href="/resource" className={navigationStyles.link}>
            Recursos
          </Link>
        </li>
        <li className={navigationStyles.linksLi}>
          <Link href="/aboutProyect" className={navigationStyles.link}>
            Sobre el Proyecto
          </Link>
        </li>
      </ul>

      {/* Button Links Mobile */}
      <button
        className={`sm:hidden grid place-items-center ml-auto focus:outline-none menu-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
      </button>

      {/* Links Mobile */}
      {isOpen && (
        <div className={navigationStyles.mobileLinksContainer}>
          <ul className="w-full flex flex-col items-center linksMenu">
            <li className={navigationStyles.linksLi} onClick={() => setIsOpen(false)}>
              <Link href="/" className={navigationStyles.link}>
                Inicio
              </Link>
            </li>
            <li className={navigationStyles.linksLi} onClick={() => setIsOpen(false)}>
              <Link href="/resource" className={navigationStyles.link}>
                Recursos
              </Link>
            </li>
            <li className={navigationStyles.linksLi} onClick={() => setIsOpen(false)}>
              <Link href="/aboutProyect" className={navigationStyles.link}>
                Acerca del Proyecto
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default MenuToggle;
