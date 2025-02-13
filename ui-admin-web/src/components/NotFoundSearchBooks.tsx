'use client'

import { useTranslations } from "next-intl";

export default function NotFoundSearchBooks() {
    const t = useTranslations("SearchBookPage");

    return (
      <div className="flex flex-col text-center mt-12 px-8 gap-10">
        <div>
          <h2 className="text-3xl font-medium">{t("bookNotFound")}</h2>
          <p className="font-light">{t("tryTheseBooks")}</p>
        </div>
      </div>
    );
  }