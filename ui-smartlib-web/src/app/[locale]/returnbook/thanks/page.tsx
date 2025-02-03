"use client";

import SelectLanguage from "@/components/SelectLanguage";
import { Link } from "@/config/i18n/routing";
import { useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ThanksDepositPage() {
  const t = useTranslations("returnThanksPage");
  const currentReturnBook=useAppSelector(state=>state.returnbooks.currentItemForCheckin)

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
            src="/images/subscribe.svg"
            width={150}
            height={300}
            className="m-auto"
            alt="suscribe  image"
          />
        </div>
        <h2 className="text-3xl font-medium mt-3 space-x-3">
          <span>{t("thanksForReturn1")}</span>
          <br />
          <span className="text-primary text-nowrap">
            {currentReturnBook?.title}
          </span>
          <span>{t("thanksForReturn2")}!</span>
        </h2>
        <p></p>
        <Link
          href="/returnbook"
          className="rounded-full z-[999] m-auto px-5 py-3 text-sm font-medium bg-primary text-white w-fit"
        >
          {t("returnBookBtn")}
        </Link>
      </section>
      <div className="pb-2">
        <p className="font-medium space-x-1">
          <span> {t("closeSessionTime1")}</span>
          <span>{t("closeSessionTime2")}</span> 3
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
