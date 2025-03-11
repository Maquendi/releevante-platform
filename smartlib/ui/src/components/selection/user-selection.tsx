"use client";

import { Link } from "@/config/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export default function UserSelectionComponent() {
  const t = useTranslations("catalogPage");

  const tHome = useTranslations("HomePage");

  return (
    <div className="pb-3">
      <header className="text-center px-7 bg-background pt-10 bg-white p-3 rounded-b-3xl">
        <div className="flex items-center  justify-between mb-5">
          <div>
            <h1 className="text-left text-4xl font-semibold">{t("title")}</h1>
            <p>{t("subTitle")}</p>
          </div>
          <Image
            priority
            className="w-[150px] h-[150px]"
            src="/images/reading-a-book.svg"
            alt="reading a book image"
            width={150}
            height={150}
          />
        </div>
      </header>
      <section className="flex gap-5 mt-5 px-5">
        <article className="grid grid-rows-[auto_1fr_auto] px-5 space-y-8 rounded-xl bg-white border border-gray-300 pt-5 pb-8">
          <figure>
            <Image
              priority
              className="w-[130px] h-[150px]"
              src="/images/love-book.svg"
              alt="reading a book image"
              width={150}
              height={150}
            />
          </figure>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold">
              {tHome("showAllBooksTitle")}
            </h3>
            <p className="font-thin">{tHome("showAllBooksText")}</p>
          </div>
          <div className="flex">
            <Link
              className="bg-primary text-center w-full flex-grow-1 mt-2 px-6 py-4 rounded-full font-medium text-sm text-white"
              href="/explore"
            >
              {tHome("showAllBooksBtn")}
            </Link>
          </div>
        </article>
        <article className="grid grid-rows-[auto_1fr_auto] px-5 space-y-8 rounded-xl bg-white border border-gray-300 pt-5 pb-8">
          <figure>
            <Image
              priority
              className="w-[130px] h-[150px]"
              src="/images/listening-music-reverse.svg"
              alt="listeging to music  image"
              width={150}
              height={150}
            />
          </figure>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold">
              {" "}
              {tHome("helpFindBookTitle")}
            </h3>
            <p className="font-thin">{tHome("helpFindBookText")}</p>
          </div>
          <div className="flex">
            <Link
              className="bg-primary text-center w-full flex-grow-1 mt-2 px-6 py-4 rounded-full font-medium text-sm text-white"
              href="/vibes/readingvibe"
            >
              {tHome("helpFindBookBtn")}
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
