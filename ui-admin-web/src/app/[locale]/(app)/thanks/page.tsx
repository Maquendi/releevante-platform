"use client";

import MaxWithWrapper from "@/components/MaxWithWrapper";
import { Link } from "@/config/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ThanksPage() {
  const t = useTranslations("thanksPage");

  return (
    <MaxWithWrapper className="max-w-[800px] mt-7 ">
      <section className="bg-white rounded-xl  py-8 grid place-content-center px-5  text-center gap-5 w-full m-auto  ">
        <div>
          <Image
            src="/images/reading-a-book-checked.svg"
            width={150}
            height={300}
            className="m-auto"
            alt="reading a book image"
          />
        </div>
        <div className="max-w-[300px] space-y-4 mt-2">
          <h2 className="text-2xl md:text-3xl font-medium ">{t("title")}</h2>
          <p className="text-gray-500 font-light">{t("content")}</p>
          <div className="pt-2">
            <Link
              href="/"
              className="rounded-full  m-auto px-5 py-3 text-sm font-medium bg-primary text-white w-fit"
            >
              {t("goBackBtn")}
            </Link>
          </div>
        </div>
      </section>
    </MaxWithWrapper>
  );
}
