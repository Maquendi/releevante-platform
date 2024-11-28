"use client";
import { FetchAllBookByCategory } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

interface HeaderBannerProp {
  subCategoryId: string;
  categoryId: string;
}

export default function HeaderBanner({
  categoryId,
  subCategoryId,
}: HeaderBannerProp) {
  const locale = useLocale();
  const t = useTranslations("SeeAllPage");
  const { data: categoryBooks } = useQuery({
    queryKey: ["BOOKS_BY_CATEGORIES", categoryId],
    queryFn: () => FetchAllBookByCategory(categoryId),
  });

  const bookByCategory = useMemo(() => {
    const data = categoryBooks?.filter(
      (item) => item.subCategory.id === subCategoryId
    );
    return data?.length ? data[0] : null;
  }, [categoryBooks, subCategoryId, categoryId]);

  return (
    <header className="text-center px-7 bg-background  bg-white p-3 rounded-b-3xl">
      <div className="flex items-center  justify-between mb-5">
        <div>
          <h1 className="text-left text-4xl mb-1 font-semibold space-x-2">
            <span>
              {bookByCategory?.subCategory[`${locale}SubCategoryName`]}
            </span>
            {categoryId && (
              <>
                <span>in</span>
                <span className="text-primary">
                  {bookByCategory?.category[`${locale}CategoryName`]}
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
  );
}
