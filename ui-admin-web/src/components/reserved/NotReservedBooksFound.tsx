import { getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

export default  async function NotReservedBooksFound() {
  const t =  await getTranslations("reservedBooks");

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
     <Button className="w-fit m-auto rounded-3xl hover:text-primary">
      {t('reserveBookBtn')}
     </Button>
    </div>
  );
}
