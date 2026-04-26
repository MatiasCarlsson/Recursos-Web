import "@/styles/linksHoverEffect.css";
import Link from "next/link";
import Image from "next/image";
import MenuToggle from "./MenuToggle";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 items-center text-center backdrop-blur-md border-b border-border/30">
      <nav className="flex items-center w-full relative justify-between max-w-7xl mx-auto py-2">
        <div className="w-32 md:w-40 flex shrink-0">
          <Link href="/">
            <Image
              src="/svg/MC.svg"
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
