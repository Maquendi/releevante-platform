"use client";
import {
  FetchAllBookByCategory,
  FetchAllBookCategories,
} from "@/actions/book-actions";
import {
  CategoryGraph,
  PartialBook,
  SubCategoryGraph,
} from "@/book/domain/models";
import BookItem from "@/components/catalogByCategory/BookItem";
import CatalogSliderItem from "@/components/catalogByCategory/CatalogSliderItem";
import SeeAllBooks from "@/components/catalogByCategory/SeeAllBooks";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import useFilterBooksByCategory from "@/hooks/useFilterBooksByCategory";
import useLibraryInventory from "@/hooks/useLibraryInventory";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import SubCategoryComponent from "../subcategory/SubCategoryComponent";
import { it } from "node:test";

interface HeaderBannerProp {
  subCategoryId: string;
  categoryId: string;
}

export default function SeeAllBookComponent({
  categoryId,
  subCategoryId,
}: HeaderBannerProp) {
  const locale = useLocale();
  const t = useTranslations("SeeAllPage");

  const { shardCategoryGraph } = useLibraryInventory();

  const { selected, remaining } = shardCategoryGraph(categoryId, subCategoryId);

  return (
    <div className=" space-y-5 mb-5">
      <header className="text-center px-7 bg-background  bg-white p-3 rounded-b-3xl">
        <div className="flex items-center  justify-between mb-5">
          <div>
            <h1 className="text-left text-4xl mb-1 font-semibold space-x-2">
              <span>
                {selected?.subCategories?.length &&
                  selected?.subCategories[0][`${locale}`]}
              </span>
              {categoryId && (
                <>
                  <span>in</span>
                  <span className="text-primary">
                    {selected?.[`${locale}`]}
                  </span>
                </>
              )}
            </h1>
            <p>{t("subTitleBanner")}</p>
          </div>
          <Image
            className="w-[150px] h-[150px]"
            src="/images/love-book.svg"
            alt="reading a book image"
            width={150}
            height={150}
          />
        </div>
      </header>
      <section className="px-5 mt-5 space-y-6">
        <SeeAllBooks category={selected} />
        <HelpFindBookBanner />
        <Suspense>
          <div className="space-y-5">
            {remaining?.subCategories?.map((item, index) => (
              <SubCategoryComponent
                key={index}
                subCategory={item}
                categoryId={selected?.id}
              />
            ))}
          </div>
        </Suspense>
      </section>
    </div>
  );
}
