import Link from "next/link";
import Image from "next/image";
import "@/styles/linksHoverEffect.css";
import MenuToggle from "./MenuToggle";

function Header() {
  return (
    <header className="relative w-full items-center text-center z-50 ">
      <nav className="flex items-center w-full relative justify-between max-w-7xl mx-auto py-2 ">
        <div className="w-32 md:w-40 flex shrink-0">
          <Link href="/">
            <Image
              src="/MC.svg"
              alt="Logo"
              width={200}
              height={10}
              loading="eager"
              style={{ width: "auto", height: "auto" }}
              className=" cursor-pointer hover:scale-110 transition-transform duration-300 aspect-auto"
            />
          </Link>
        </div>
        <MenuToggle />
      </nav>
    </header>
  );
}

export default Header;
