"use client";
import React, { Suspense, useState } from "react";
import SelectLanguage from "./SelectLanguage";
import Image from "next/image";
import { Link, usePathname } from "@/config/i18n/routing";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";

const CartSidebarTrigger = dynamic(() => import("./CartSidebarTrigger"), {
  ssr: false,
});

function LogoutDropDown() {
  const { logoutMutation } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Image
          src="/icons/logout.svg"
          className="w-[30px] h-[30px]"
          width={40}
          height={40}
          alt={`icon image logout`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-20 -mt-8 rounded-xl shadow-2xl">
        <DropdownMenuLabel>Are you sure you want to logout?</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:bg-none">
          <Button
            onClick={handleLogout}
            className="px-6 py-5 rounded-full text-center w-full hover:text-primary"
          >
            Yes, please
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button className="text-center w-full" onClick={() => setOpen(false)}>
            No, I want to stay
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const path = usePathname();
  const { isUserSignin } = useAuth();
  return (
    <nav className="flex justify-between items-center px-6 bg-white py-2 border border-b border-secondary">
      <div className="flex gap-2 items-center">
        <Suspense>
          <SelectLanguage />
        </Suspense>


        <Link href={"/explore"}>
          <Image
            width={40}
            height={40}
            className="w-[30px] h-[30px]"
            src="/icons/home.svg"
            alt="home icon"
          />
        </Link>
      </div>

      {path.endsWith("selection") && (
        <div>
          <Image
            width={100}
            height={100}
            className="w-[130px] h-auto"
            src="/images/releevante.svg"
            alt="home icon"
          />
        </div>
      )}

      <div className="flex gap-5">
        {!path.endsWith("selection") && (
          <Link href="/search">
            <Image
              src="/icons/search.svg"
              className="w-[30px] h-[30px]"
              width={40}
              height={40}
              alt={`icon image search`}
            />
          </Link>
        )}
        {isUserSignin && <LogoutDropDown />}
        {!path.endsWith("selection") && <CartSidebarTrigger />}
      </div>
    </nav>
  );
}
