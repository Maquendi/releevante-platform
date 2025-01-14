"use client";
import { FetchAllBookCategories } from "@/actions/book-actions";
import useFilterBooksByCategory from "@/hooks/useFilterBooksByCategory";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  const {booksByCategory}=useFilterBooksByCategory({categoryId})
  const searchParams=useSearchParams()

  const isRecomendatonBooks=useMemo(()=>{
    const hasParams = [...searchParams!.keys()].length > 0;
    return hasParams !== searchParams?.has('subCategoryId') ? true: false
  },[searchParams])

  const bookByCategoryFiltered = useMemo(() => {
    const data = booksByCategory?.filter(
      (item) => item.subCategory.id === subCategoryId
    );
    return data?.length ? data[0] : null;
  }, [booksByCategory, subCategoryId]);

  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
    refetchOnMount:false,
    refetchOnWindowFocus:false
  });

  const currentCategory=useMemo(()=>{
    return categories?.find(item=>item.id === categoryId)
  },[categories,categoryId])


  return (
    <header className="text-center px-7 bg-background  bg-white p-3 rounded-b-3xl">
      <div className="flex items-center  justify-between mb-5">
        <div>
          <h1 className="text-left text-4xl mb-1 font-semibold space-x-2">
            <span>
              { isRecomendatonBooks ? t('allRecomendationsTitle'): bookByCategoryFiltered?.subCategory[`${locale}TagValue`]}
            </span>
            {categoryId && (
              <>
                <span>in</span>
                <span className="text-primary">
                  {currentCategory?.[`${locale}TagValue`]}
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
