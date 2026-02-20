import Link from "next/dist/client/link";
import Image from "next/image";
import "@/styles/underlineHoverEffect.css";

const navigationStyles = {
  links: "italic p-4 cursor-pointer text-md md:text-base lg:text-xl",
};

export default function Header() {
  return (
    <header className="relative flex items-center justify-between my-3 bg-[#0a001a]">
      <nav className="flex items-center">
        <div className="w-40">
          <Link href="/">
            <Image
              src="/MC.svg"
              alt="Logo"
              width={200}
              height={10}
              loading="eager"
              style={{ width: "auto", height: "auto" }}
              className="cursor-pointer hover:scale-110 transition-transform duration-300 aspect-auto"
            />
          </Link>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex linksMenu">
            <li className={navigationStyles.links}>
              <Link href="/">Inicio</Link>
            </li>
            <li className={navigationStyles.links}>
              <Link href="/resource">Recursos</Link>
            </li>
            <li className={navigationStyles.links}>
              <Link href="/aboutProyect">Acerca del Proyecto</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
