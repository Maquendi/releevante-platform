"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { Link } from "@/config/i18n/routing";
import { useTranslations } from "next-intl";
import SelectLanguage from "./SelectLanguage";

const AuthNavbar = () => {
  const t = useTranslations("wristbandScanAuth");

  return (
    <nav className="w-full flex justify-between items-center px-8 mt-2 ">
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
      <div>
        <p className="font-light">{t("header")}</p>
      </div>
    </nav>
  );
};

export default AuthNavbar;
