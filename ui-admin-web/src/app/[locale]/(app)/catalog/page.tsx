import Image from "next/image";
import React from "react";
import BookNotFound from "@/components/BookNotFound";
import CatalogSliderItem from "@/components/catalogByCategory/CatalogSliderItem";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import { getTranslations } from "next-intl/server";
import {
  FetchAllBookCategories,
  FetchBookByCategory,
} from "@/actions/book-actions";
import BookCategories from "@/components/catalogByCategory/BookCategories";
import MaxWithWrapper from "@/components/MaxWithWrapper";
import { Button } from "@/components/ui/button";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const t = await getTranslations("catalogPage");
  const booksByCategory = await FetchBookByCategory(searchParams?.categoryId);
  const allCategories = await FetchAllBookCategories();

  return (
    <div className="space-y-4 pb-5">
      <header className="text-center  bg-background pt-10 bg-white p-3 rounded-b-3xl">
        <MaxWithWrapper>
          <div className="grid grid-rows-2 place-items-center md:flex flex-row-reverse gap-y-2 items-center  justify-center md:justify-between mb-5">
            <Image
              priority
              className="w-[150px] h-[150px]"
              src="/images/reading-a-book.svg"
              alt="reading a book image"
              width={150}
              height={150}
            />
            <div className="flex flex-col  items-center md:items-start gap-y-2">
              <h1 className="text-left text-3xl md:text-4xl font-semibold">
                {t("title")}
              </h1>
              <p>{t("subTitle")}</p>
              <Button className="w-fit rounded-3xl text-sm px-6 py-5 hover:text-primary">
                Recommend me a book
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-secondary-foreground uppercase font-medium text-sm ">
              {t("selectCategory")}
            </h3>
            <BookCategories allCategories={allCategories} />
          </div>
        </MaxWithWrapper>
      </header>
      <MaxWithWrapper>
        <section className="space-y-6 ">
          {!booksByCategory?.length ? (
            <div className="space-y-5">
              <BookNotFound />
              <HelpFindBookBanner />
            </div>
          ) : null}
          {booksByCategory?.map((item, index) => (
            <CatalogSliderItem key={index} {...item} />
          ))}
        </section>
      </MaxWithWrapper>
    </div>
  );
}
