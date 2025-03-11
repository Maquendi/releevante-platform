import AuthNavbar from "@/components/AuthNavbar";
import Image from "next/image";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] ">
      <AuthNavbar />
        <figure className="">
          <Image
            priority
            className="object-contain m-auto w-[280px] h-auto"
            src="/images/releevante.svg"
            alt="relevant title image"
            width={300}
            height={300}
          />
        </figure>
        {children}
    </div>
  );
}
