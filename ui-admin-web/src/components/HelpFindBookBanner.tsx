
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function HelpFindBookBanner() {
  const t =  await getTranslations("catalogPage");

  return (
    <div className="relative h-[380px] md:h-auto flex justify-between bg-[#E4E73D]  rounded-md p-8 overflow-hidden">
      <div className="space-y-4 flex flex-col items-center text-center md:items-start">
        <h3 className="text-xl font-medium">{t("findRightBook")}</h3>
        <p className="text-sm text-black font-light">{t("helpMessage")}</p>
        <Button className="rounded-3xl  px-6 py-5 tracking-widest">
          {t("startNow")}
        </Button>
      </div>
      <Image
        src="/images/work-in-progress.svg"
        width={150}
        height={150}
        className="absolute object-contain  -bottom-28  md:bottom-0 right-0 md:top-0 w-[180px] h-full"
        alt="help find right book image"
      />
    </div>
  );
}
