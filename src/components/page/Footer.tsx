import Link from "next/dist/client/link";
import SocialMedia from "../SocialLink";

const textResponsive = "text-xs sm:text-sm md:text-base lg:text-lg";

const styles = {
  responsiveDisplay: "grid sm:grid-col-1 md:grid-cols-3 justify-items-center whitespace-nowrap",

  styleSocialMedia:
    "group flex items-center bg-cardBackground rounded-full w-fit p-1.5 sm:p-0.5 md:p-1.5 lg:p-2 transition-all duration-300 hover:bg-backgroundCard hover:text-white",

  styleMediaName:
    "max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-20 sm:group-hover:max-w-25 md:group-hover:max-w-30 group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap",

  link: "hover:text-textPrimary hover:underline transition-all duration-400 hover:underline-offset-4 active:scale-95",
};

export default function Footer() {
  return (
    <footer
      className={`${styles.responsiveDisplay} ${textResponsive} font-semibold bg-footerBackground shadow-footerShadow italic py-4 text-textSecondary`}
    >
      <section className="flex flex-col gap-2">
        <p>Contacto</p>

        <div className="">
          <p>matiascarlsson1@gmail.com</p>
        </div>

        <div className="flex flex-col gap-2">
          <SocialMedia
            href="https://www.linkedin.com/in/matias-carlsson"
            iconSrc="/linkedin.svg"
            altText="Linkedin icon"
            mediaName="LinkedIn"
            className={`${styles.styleSocialMedia} ${textResponsive}`}
            styleMediaName={`${styles.styleMediaName} ${textResponsive}`}
          ></SocialMedia>

          <SocialMedia
            href="https://github.com/MatiasCarlsson"
            iconSrc="/github.svg"
            altText="Github icon"
            mediaName="Github"
            className={`${styles.styleSocialMedia} ${textResponsive}`}
            styleMediaName={`${styles.styleMediaName} ${textResponsive}`}
          ></SocialMedia>
        </div>
      </section>

      <section className="sm:order-first md:order-0 lg:order-0">
        <p className="">
          &copy; {new Date().getFullYear()} Mi sitio Web. Todos los derechos reservados.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <p className="">Links</p>
        <Link href="/resource" className={`${styles.link} ${textResponsive}`}>
          Recursos
        </Link>
        <Link href="/aboutProyect" className={`${styles.link} ${textResponsive}`}>
          Sobre el proyecto
        </Link>
        <button className={`${styles.link} ${textResponsive} flex justify-start cursor-pointer`}>
          Inicio
        </button>
      </section>
    </footer>
  );
}
