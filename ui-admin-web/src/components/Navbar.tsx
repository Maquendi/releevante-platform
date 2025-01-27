"use client";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import SelectLanguage from "./SelectLanguage";
import { Link } from "@/config/i18n/routing";
import { Input } from "./ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onlyMobile?: boolean;
}

export default function Navbar({ onlyMobile }: NavbarProps) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 770px)" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputFocus = () => {};

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

  return (
    <nav className="flex gap-5 px-4 justify-between items-center py-1 border-b border-gray-300 bg-white">
      <figure className="relative w-[100px] h-[50px]">
        <Image
          fill
          className="object-contain"
          src="/images/releevante.svg"
          alt="relevant title image"
          sizes="160px"
        />
      </figure>
      <Link href={"/"}>
        <Image
          width={40}
          height={40}
          className="w-[30px] h-[30px]"
          src="/icons/home.svg"
          alt="home icon"
        />
      </Link>
      <div onClick={handleInputFocus} className="relative flex-grow">
        <Input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 py-5 w-full px-5 rounded-md transition duration-500"
        />
        <div className="absolute  text-white rounded-full px-0.5 py-0.5 right-3 top-1/2 -translate-y-1/2">
          <Search name="search" size={15} className=" text-black" />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          className="rounded-3xl px-4 py-2 bg-inherit  border-gray-500"
        >
          <span className="text-xs">Login</span>
        </Button>
        <SelectLanguage />
      </div>
      <Link href={"/home"}>
        <Image
          width={40}
          height={40}
          className="w-[30px] h-[30px]"
          src="/icons/cart.svg"
          alt="cart icon"
        />
      </Link>
    </nav>
  );
}
