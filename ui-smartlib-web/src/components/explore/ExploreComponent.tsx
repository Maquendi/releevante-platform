"use client";
import { loadLibraryInventory } from "@/actions/book-actions";
import { Link } from "@/config/i18n/routing";
import { arrayGroupinBy, cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import BookNotFound from "../BookNotFound";
import HelpFindBookBanner from "../HelpFindBookBanner";
import SubCategoryComponent from "./subcategory/SubCategoryComponent";
import { PartialBook, SubCategoryGraph } from "@/book/domain/models";

interface CatalogPageProps {
  categoryId: string;
}

export default function ExploreComponent({ categoryId }: CatalogPageProps) {
  const t = useTranslations("catalogPage");
  
  const { data: inventory, isPending } = useQuery({
    queryKey: ["CATEGORY_GRAPH", categoryId],
    queryFn: async () =>
      await loadLibraryInventory().then((libraryInventory) => {
        const categories = libraryInventory.categories;
        console.log(libraryInventory)
        if (!categoryId) {
          const subCategoriesDuplicated = libraryInventory.categories.flatMap(
            (category) => category.subCategories
          );

          const subCategoriesGrouped = arrayGroupinBy(subCategoriesDuplicated, 'id')
          
          const subCategories = Object.keys(subCategoriesGrouped).map(key => {
            const subCategories: SubCategoryGraph[] = subCategoriesGrouped[key];
            const first = subCategories[0];            
            const myMap = new Map<string, PartialBook>()
            subCategories.flatMap(item => item.books).forEach(item =>{
              myMap.set(item.isbn, item);
            });
            first.books = Array.from(myMap.values())
            return first;
          })

          console.log(subCategoriesGrouped)

          console.log(subCategories)

          return {
            categories,
            subCategories,
          };
        } else {
          const subCategories =
            libraryInventory.categories.find(
              (category) => category.id == categoryId
            )?.subCategories || [];

          return {
            categories,
            subCategories,
          };
        }
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const locale = useLocale();

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
              href={`/explore`}
              scroll={false}
            >
              All
            </Link>
            {inventory?.categories?.map((category) => (
              <Link
                className={cn(
                  "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                  categoryId === category?.id &&
                    "bg-primary border-4 border-accent-foreground text-white"
                )}
                href={`/explore?categoryId=${category?.id}`}
                key={category?.id}
              >
                {category?.[`${locale}`] || ""}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <section className="space-y-6 px-6">
        {!inventory?.subCategories?.length && !isPending ? (
          <div className="space-y-5">
            <BookNotFound />
            <HelpFindBookBanner />
          </div>
        ) : null}
        {inventory?.subCategories?.map((item, index) => (
          <SubCategoryComponent key={index} {...item} />
        ))}{" "}
      </section>
    </div>
  );
}
