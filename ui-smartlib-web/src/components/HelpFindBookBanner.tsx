'use client'
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HelpFindBookBanner() {
  const t = useTranslations("catalogPage");

  return (
    <div className="relative flex justify-between bg-[#E4E73D]  rounded-md p-8 overflow-hidden">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">{t("findRightBook")}</h3>
        <p className="text-sm text-black font-light">{t("helpMessage")}</p>
        <Button className="rounded-3xl bg-white text-black px-6 tracking-widest">
          {t("startNow")}
        </Button>
      </div>
      <Image
        src="/images/work-in-progress.svg"
        width={150}
        height={150}
        className="absolute object-contain right-0 top-0 bottom-0 w-[180px] h-full"
        alt="book not found image"
      />
    </div>
  );
}
