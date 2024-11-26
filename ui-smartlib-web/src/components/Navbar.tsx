import React from "react";
import SelectLanguage from "./SelectLanguage";
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  {
    icon: "/icons/search.svg",
    path: "/search",
    value: "search",
  },
  {
    icon: "/icons/logout.svg",
    path: "/logout",
    value: "logout",
  },
  {
    icon: "/icons/cart.svg",
    path: "/cart",
    value: "cart",
  },
];

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 bg-white pt-2">
      <div className="flex gap-2 items-center">
        <SelectLanguage />
        <Link href={"/catalog"}>
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
        {LINKS.map((item) => (
          <article key={item.path}>
            <Image
              src={item.icon}
              className="w-[30px] h-[30px]"
              width={40}
              height={40}
              alt={`icon image ${item.value}`}
            />
          </article>
        ))}
      </div>
    </nav>
  );
}
