'use client'
import React, { Suspense } from "react";
import SelectLanguage from "./SelectLanguage";
import Image from "next/image";
import { Link } from "@/config/i18n/routing";
import { CartSidebarTrigger } from "./CartSidebar";
import useAuth from "@/hooks/useAuth";


export default function Navbar() {
  const { logoutMutation } = useAuth();
  return (
    <nav className="flex justify-between items-center px-6 bg-white py-2 border border-b border-secondary">
      <div className="flex gap-2 items-center">
        <Suspense>
          <SelectLanguage />
        </Suspense>

        <Link href={"/home"}>
          <Image
            width={40}
            height={40}
            className="w-[30px] h-[30px]"
            src="/icons/home.svg"
            alt="home icon"
          />
        </Link>
      </div>
      <div>
        <Image
          width={100}
          height={100}
          className="w-[130px] h-auto"
          src="/images/releevante.svg"
          alt="home icon"
        />
      </div>
      <div className="flex gap-5">
    
        <Link href="/search">
          <Image
            src="/icons/search.svg"
            className="w-[30px] h-[30px]"
            width={40}
            height={40}
            alt={`icon image search`}
          />
        </Link>

        <button onClick={() => logoutMutation.mutate()}>
          <Image
            src="/icons/logout.svg"
            className="w-[30px] h-[30px]"
            width={40}
            height={40}
            alt={`icon image logout`}
          />
        </button>
        <CartSidebarTrigger />
      </div>
    </nav>
  );
}
