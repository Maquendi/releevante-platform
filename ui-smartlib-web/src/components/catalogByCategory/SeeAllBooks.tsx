"use client";

import {  FetchAllBookCategories } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import BookItem from "./BookItem";
import { useLocale, useTranslations } from "next-intl";
import useFilterBooksByCategory from "@/hooks/useFilterBooksByCategory";
import { useSearchParams } from "next/navigation";
import useGetRecomendationBooks from "@/hooks/useGetRecomendationBooks";

interface SeeAllBooksPros {
  subCategoryId: string;
  categoryId: string;
}

function SeeAllBooks({ subCategoryId, categoryId }: SeeAllBooksPros) {
  const locale = useLocale();
  const searchParams=useSearchParams()
  const {booksByCategory} = useFilterBooksByCategory({ categoryId });
  const t = useTranslations('SeeAllPage')
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
    refetchOnMount:false,
    refetchOnWindowFocus:false
  });
  const seachParamObj = Object.fromEntries( searchParams!.entries() );

  const {allBooks}=useGetRecomendationBooks({searchParams:seachParamObj})

  const bookByCategory = useMemo(() => {
    const hasParams = [...searchParams!.keys()].length > 0;
    if(hasParams !== searchParams?.has('subCategoryId')){
      return allBooks
    }
    const data = booksByCategory?.filter(
      (item) => item.subCategory.id === subCategoryId
    );
    return data?.length ? data[0]?.books : null;
  }, [booksByCategory, subCategoryId,allBooks,searchParams]);


  const currentCategory=useMemo(()=>{
    return categories?.filter(item=>item.id === categoryId)
  },[categories,categoryId])


  return (
    <div className="min-h-[250px]">
      <h2 className="text-xl font-medium space-x-2 mb-5">
        {categoryId && (
          <span>{currentCategory?.[`${locale}CategoryName`]}</span>
        ) }
        <span className=" first-letter:uppercase capitalize">{t("books")}</span>
        <span className="text-secondary-foreground font-light">
          ({bookByCategory?.length})
        </span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5">
        {bookByCategory?.map((book) => (
          <BookItem
            className="text-xs"
            key={book.id}
            width={140}
            height={180}
            book={book}
          />
        ))}
      </div>
    </div>
  );
}

export default SeeAllBooks;
