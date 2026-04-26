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
  return (
    <footer
      className={`${styles.responsiveDisplay} ${textResponsive} font-semibold bg-footerBackground shadow-footerShadow italic py-4 text-textSecondary mt-10 px-4 text-center md:text-left`}
    >
      <section className="flex flex-col gap-2 items-center md:items-start">
        <p>Contacto</p>

        <div className="">
          <p>matiascarlsson1@gmail.com</p>
        </div>

        <div className="flex gap-3 md:flex-col items-center md:items-start">
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
