"use client";

import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import SelectLanguage from "./SelectLanguage";
import { Link, usePathname } from "@/config/i18n/routing";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import NavbarV2 from "./NavbarV2";
import { CartSidebarTrigger } from "./CartSidebar";



const navbarv2MobileRoutes = [
  {
    prevRouteIntName: "cartRoute",
    path: "/reviewcart",
    prevRoutePath: "/cart",
  },
  {
    prevRouteIntName: "codeValidationRoute",
    path: "/code",
    prevRoutePath: "/",
  },
  {
    prevRouteIntName: "codeValidationRoute",
    path: "/thanks",
    prevRoutePath: "/code",
  },
  {
    prevRouteIntName: "codeValidationRoute",
    path: "/rating",
    prevRoutePath: "/code",
  },
  {
    prevRouteIntName: "catalogRoute",
    path: "/reserved",
    prevRoutePath: "/catalog",
  },
] as const;

export default function Navbar() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 770px)" });
  const path = usePathname();
  
  const pathInfo = navbarv2MobileRoutes.find((route) => route.path === path);
  const isReservedDesktop = path === "/reserved" && !isTabletOrMobile;

  if (pathInfo && (isTabletOrMobile || isReservedDesktop)) {
    return (
      <NavbarV2
        prevRouteIntl={pathInfo.prevRouteIntName}
        middleNameInt={isReservedDesktop ? "booksRoute" : undefined}
        href={pathInfo.prevRoutePath}
      />
    );
  }

  if (isTabletOrMobile) {
    return (
      <nav className="flex justify-between px-2 py-2 bg-white">
        <SelectLanguage />
        <figure className="relative w-[160px] h-[50px]">
          <Image
            fill
            className="object-contain"
            src="/images/releevante.svg"
            alt="Releevante Logo"
            sizes="160px"
          />
        </figure>
        <CartSidebarTrigger />
      </nav>
    );
  }


  return (
    <nav className="flex gap-5 px-4 justify-between items-center py-1 border-b border-gray-300 bg-white">
      <figure className="relative w-[170px] h-[50px]">
        <Image
          fill
          className="object-contain"
          src="/images/releevante.svg"
          alt="Releevante Logo"
          sizes="160px"
        />
      </figure>
      <Link href="/">
        <Image
          width={40}
          height={40}
          className="w-[40px] h-[40px]"
          src="/icons/home.svg"
          alt="Home Icon"
        />
      </Link>
      <Link
        href="/search"
        className="relative flex-grow py-3 text-sm text-gray-400 w-full px-5 border border-gray-300 rounded-md transition duration-500"
      >
        <span>Search...</span>
        <div className="absolute text-white rounded-full px-0.5 py-0.5 right-3 top-1/2 -translate-y-1/2">
          <Search name="search" size={15} className="text-black" />
        </div>
      </Link>
      <div className="flex gap-2 items-center">
        <Button variant="outline" className="rounded-3xl px-4 py-2 bg-inherit border-gray-500">
          <span className="text-xs">Login</span>
        </Button>
        <SelectLanguage />
      </div>
      <CartSidebarTrigger />
    </nav>
  );
}
