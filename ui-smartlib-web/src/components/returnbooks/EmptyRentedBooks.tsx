"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function EmptyRentedBooks() {
  const t = useTranslations("returnBook");

  return (
    <div className="space-y-7 text-center mb-7 px-20">
      <Image
        width={300}
        height={200}
        src="/images/book-notfound.jpg"
        alt="book item in cart"
        className="w-[150px] h-auto rounded-md object-cover m-auto"
      />
      <p className="font-light">
        <span>{t("noRentedBooks")}</span>
      </p>
    </div>
  );
}
