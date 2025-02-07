"use client";

import SelectLanguage from "@/components/SelectLanguage";
import { Link } from "@/config/i18n/routing";
import useLogoutOnTimeout from "@/hooks/useLogoutOnTimeout";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ThanksPage() {
  const t = useTranslations("thanksPage");

  useLogoutOnTimeout(5000);

  return (
    <div className=" min-h-screen grid grid-rows-[auto_1fr_auto] text-center">
      <nav className="flex justify-between px-5 py-3">
        <SelectLanguage />
        <Image
          src="/images/releevante.svg"
          width={150}
          height={300}
          className="w-[110px]"
          alt="relevante name image"
        />
      </nav>
      <section className="grid place-content-center px-5  text-center gap-5 max-w-[500px] m-auto mt-20 ">
        <div>
          <Image
            src="/images/reading-a-book-checked.svg"
            width={150}
            height={300}
            className="m-auto"
            alt="reading a book image"
          />
        </div>
        <h2 className="text-3xl font-medium mt-3">{t("title")}</h2>
        <p>{t("content")}</p>
        <Link
          href="/"
          className="rounded-full z-[999] m-auto px-5 py-3 text-sm font-medium bg-primary text-white w-fit"
        >
          Ok
        </Link>
      </section>
      <div className="pb-2">
        <p className="font-medium space-x-1">
          <span> {t("closeSessionTime1")}</span>
          <span>{t("closeSessionTime2")}</span> 5
          <span>{t("closeSessionTime3")}</span>
        </p>{" "}
      </div>
      <div className="fixed -bottom-12 left-0 right-0">
        <figure className="relative w-[700px] h-[500px]">
          <Image
            src="/images/releevante-initial.svg"
            fill
            alt="reading a book image"
          />
        </figure>
      </div>
    </div>
  );
}
