"use client";

import { useState } from "react";
import Link from "next/link";
import SocialMedia from "../SocialLink";

const textResponsive = "text-xs sm:text-sm md:text-base lg:text-lg";

const styles = {
  // center content on small screens, left-align on md+; 3 columns on md+
  responsiveDisplay:
    "grid sm:grid-cols-1 md:grid-cols-3 justify-items-center md:justify-items-around gap-6",

  styleSocialMedia:
    "group flex items-center bg-cardBackground rounded-full w-fit p-1.5 sm:p-0.5 md:p-1.5 lg:p-2 transition-all duration-300 hover:bg-backgroundCard hover:text-white",

  // media name hidden on xs, shown from sm; spacing handled by wrapper
  styleMediaName: "hidden sm:inline-block ml-2 transition-opacity duration-300",

  link: "hover:text-textPrimary hover:underline transition-all duration-400 hover:underline-offset-4 active:scale-95",
};

export default function Footer() {
  const gmailAddress = "matiascarlsson1@gmail.com";
  const [isGmailCopied, setIsGmailCopied] = useState(false);

  async function handleGmailClick() {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(gmailAddress);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = gmailAddress;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setIsGmailCopied(true);
      window.setTimeout(() => setIsGmailCopied(false), 1600);
    } else {
      setIsGmailCopied(false);
    }
  }

  return (
    <footer
      className={`${styles.responsiveDisplay} ${textResponsive} font-semibold bg-footerBackground shadow-footerShadow italic py-4 text-textSecondary mt-10 px-4 text-center md:text-left`}
    >
      <section className="flex flex-col gap-2 items-center md:items-start w-10">
        <p>Contacto</p>

        <div className="flex gap-16 md:flex-col md:gap-3 items-center md:items-start">
          <div className="relative">
            <SocialMedia
              href="/sobre-el-proyecto#contacto"
              iconSrc="/svg/gmial.svg"
              altText="Gmail icon"
              mediaName="Gmail"
              className={`${styles.styleSocialMedia} ${textResponsive}`}
              styleMediaName={`${styles.styleMediaName} ${textResponsive}`}
              target="_self"
              onClick={handleGmailClick}
            />
            <span
              className={`pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-buttonColor/40 bg-cardBackground/90 px-2 py-0.5 text-[10px] font-semibold text-textPrimary shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-200 ${isGmailCopied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
              Gmail copiado
            </span>
          </div>

          <SocialMedia
            href="https://www.linkedin.com/in/matias-carlsson"
            iconSrc="/svg/linkedin.svg"
            altText="Linkedin icon"
            mediaName="LinkedIn"
            className={`${styles.styleSocialMedia} ${textResponsive}`}
            styleMediaName={`${styles.styleMediaName} ${textResponsive}`}
          />

          <SocialMedia
            href="https://github.com/MatiasCarlsson"
            iconSrc="/svg/github.svg"
            altText="Github icon"
            mediaName="Github"
            className={`${styles.styleSocialMedia} ${textResponsive}`}
            styleMediaName={`${styles.styleMediaName} ${textResponsive}`}
          />
        </div>
      </section>

      <section className="sm:order-first md:order-0 lg:order-0 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Mi sitio Web. Todos los derechos reservados.</p>
      </section>

      <section className="flex flex-col gap-2 items-center md:items-start">
        <p className="">Links</p>
        <div className="flex gap-4 md:flex-col items-center md:items-start">
          <Link href="/resource" className={`${styles.link} ${textResponsive}`}>
            Recursos
          </Link>
          <Link href="/acerca-del-proyecto" className={`${styles.link} ${textResponsive}`}>
            Sobre el proyecto
          </Link>
          <Link href="/" className={`${styles.link} ${textResponsive}`}>
            Inicio
          </Link>
        </div>
      </section>
    </footer>
  );
}
