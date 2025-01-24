import { getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";

export default  async function BookNotFound() {
  const t =  await getTranslations("catalogPage");

  return (
    <div className="grid place-content-center gap-3 py-5 px-7 text-center bg-white rounded-xl">
      <figure>
        <Image
          src="/images/book-notfound.jpg"
          width={150}
          height={150}
          className="w-[150px] h-auto m-auto"
          alt="book not found image"
        />
      </figure>
      <p className="space-x-1">
        <span>{t("notFound1")}</span>
        <span className="text-primary font-medium">Action</span>
        <span>{t("book")}.</span>
        <span>{t("notFound2")}</span>
      </p>
    </div>
  );
}
