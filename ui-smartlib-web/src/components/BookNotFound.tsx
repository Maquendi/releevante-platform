import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export default function BookNotFound() {
  const t = useTranslations("homePage");

  return (
    <div className="grid place-content-center gap-1">
      <figure>
        <Image
          src="/images/book-notfound.svg"
          width={150}
          height={150}
          className="w-[150px] h-[150px] m-auto"
          alt="book not found image"
        />
      </figure>
      <p>{t("notFound")}</p>
    </div>
  );
}
