"use client";
import { Link } from "@/config/i18n/routing";
import { formatDateByRegion } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
const TIME_REGIONS = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-DO",
} as const;

export default function EmptyRentedBooks() {
  const t = useTranslations("returnBook");
  const settings = useAppSelector((state) => state.settings);
  const locale = useLocale();

  return (
    <section className="bg-white  rounded-xl pt-6">
      <header className="flex justify-between px-4 pb-10">
        <div className="flex gap-1 items-center text-xl font-medium">
          <p>{t("book")}</p>
          <p className="space-x-1 text-gray-500">
            (<span>{0}</span>
            {settings?.data && (
              <>
                <span>{t("of")}</span>
                <span>{settings?.data?.maxBooksPerLoan}</span>
              </>
            )}
            )
          </p>
        </div>
        <div className="text-sm font-medium text-gray-500">
          <p className="first-letter:uppercase">
            <span>{t("returnDate")}</span>:{" "}
            <span>
              {formatDateByRegion(
                new Date(),
                TIME_REGIONS?.[locale] || "en-US"
              )}
            </span>
          </p>
        </div>
      </header>
      <div className="space-y-7 text-center mb-14 px-20 ">
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
      <div className="flex relative    justify-center py-4 border-t border-gray-200 ">
        <Link
          href={"/catalog"}
          className="m-auto border rounded-full font-medium tracking-wider text-sm py-4 px-7 border-primary text-primary bg-transparent"
        >
          {t("rentBook")}
        </Link>
      </div>
    </section>
  );
}
