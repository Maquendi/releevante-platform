"use client";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import SelectLanguage from "./SelectLanguage";

interface NavbarProps {
  onlyMobile?: boolean;
}

export default function Navbar({ onlyMobile }: NavbarProps) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 770px)" });

  if (isTabletOrMobile) {
    return (
      <nav className="flex justify-between  px-2 py-2 bg-white">
        <SelectLanguage />
        <figure className="relative w-[160px] h-[50px">
          <Image
            fill
            className="object-contain"
            src="/images/releevante.svg"
            alt="relevant title image"
            sizes="160px"
          />
        </figure>
      </nav>
    );
  }

  if (onlyMobile) return;

  return <div>desk navbar</div>;
}
