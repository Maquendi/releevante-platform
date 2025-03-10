'use client'
import Image from "next/image";
import React from "react";
import {  buttonVariants } from "../ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";

export default   function NotReservedBooksFound() {
  const t =   useTranslations("reservedBooks");

  return (
    <div className="grid place-content-center gap-5 py-8 px-7 text-center bg-white rounded-xl">
      <figure>
        <Image
          src="/images/book-notfound.jpg"
          width={150}
          height={150}
          className="w-[150px] h-auto m-auto"
          alt="book not found image"
        />
      </figure>
      <div className="max-w-[500px]">
        <p className="font-light">{t("reserveBookEmptyMsg")}</p>
      </div>
     <Link href='/catalog' className={cn(buttonVariants({className:"w-fit m-auto rounded-3xl hover:text-primary"}))}>
      {t('reserveBookBtn')}
     </Link>
    </div>
  );
}
