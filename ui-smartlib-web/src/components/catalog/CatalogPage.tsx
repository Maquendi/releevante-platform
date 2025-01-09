"use client";
import { FetchAllBookCategories } from "@/actions/book-actions";
import { Link } from "@/config/i18n/routing";
import useFilterBooksByCategory from "@/hooks/useFilterBooksByCategory";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import BookNotFound from "../BookNotFound";
import HelpFindBookBanner from "../HelpFindBookBanner";
import CatalogSliderItem from "../catalogByCategory/CatalogSliderItem";

interface CatalogPageProps {
  categoryId: string;
}

export default function CatalogList({ categoryId }: CatalogPageProps) {
  const t = useTranslations("catalogPage");
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
    refetchOnMount:false,
    refetchOnWindowFocus:false
  });

  
  const booksByCategory = useFilterBooksByCategory({ categoryId });
  const locale=useLocale()
  
  return (
    <div className="space-y-4 pb-5">
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
        <div>
          <h3 className="mb-2 text-secondary-foreground uppercase font-medium text-sm ">
            {t("selectCategory")}
          </h3>
          <div className="flex gap-2 items-center text-sm font-medium overflow-x-scroll no-scrollbar snap-x snap-mandatory select-none whitespace-nowrap">
            <Link
              className={cn(
                "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                !categoryId &&
                  "bg-primary border-4 border-accent-foreground text-white"
              )}
              href={`/catalog`}
              scroll={false}
            >
              All
            </Link>
            {categories?.map((category) => (
              <Link
                className={cn(
                  "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                  categoryId === category?.id &&
                    "bg-primary border-4 border-accent-foreground text-white"
                )}
                href={`/catalog?categoryId=${category?.id}`}
                key={category?.id}
              >
                {category?.[`${locale}TagValue`] || ""}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <section className="space-y-6 px-6">
        {!booksByCategory?.length && (
          <div className="space-y-5">
            <BookNotFound />
            <HelpFindBookBanner />
          </div>
        )}
        {booksByCategory?.map((item, index) => (
          <CatalogSliderItem key={index} {...item} />
        ))}{" "}
      </section>
    </div>
  );
}
