"use client";

import SeeAllBooks from "@/components/catalogByCategory/SeeAllBooks";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import useLibraryInventory from "@/hooks/useLibraryInventory";
import SubCategoryComponent from "../subcategory/SubCategoryComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Category } from "@/book/domain/models";
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
  const { filterBySubCategory } = useLibraryInventory();

  const recommendation = useSelector(
    (state: RootState) => state.pageTransition.bookRecommendation
  );

  const [category, setCategory] = useState<Category>();

  const { selected, remaining } = filterBySubCategory(
    categoryId,
    subCategoryId
  );

  useEffect(() => {
    console.log("selected here *******************");
    console.log(selected);

    if (!selected && recommendation) {
      setCategory({
        ...recommendation,
      });
    } else {
      setCategory(selected);
    }

    return ()=> {
      console.log("should do cleanup here ***********************************")
    }
  }, []);

  return (
    <div className=" space-y-5 mb-5">
      <header className="text-center px-7 bg-background  bg-white p-3 rounded-b-3xl">
        <div className="flex items-center  justify-between mb-5">
          <div>
            <h1 className="text-left text-4xl mb-1 font-semibold space-x-2">
              <span>
                {category?.subCategories?.length &&
                  category?.subCategories[0][`${locale}`]}
              </span>
              {category && (
                <>
                  <span>in</span>
                  <span className="text-primary">{category[`${locale}`]}</span>
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
        <SeeAllBooks category={category!} />
        <HelpFindBookBanner />
        <Suspense>
          <div className="space-y-5">
            {remaining?.subCategories?.map((item, index) => (
              <SubCategoryComponent
                key={index}
                subCategory={item}
                categoryId={category?.id!}
              />
            ))}
          </div>
        </Suspense>
      </section>
    </div>
  );
}
