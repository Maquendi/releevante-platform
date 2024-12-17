"use client";

import { FetchAllBookByCategory, FetchAllBookCategories } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import BookItem from "./BookItem";
import { useLocale } from "next-intl";
import useFilterBooksByCategory from "@/hooks/useFilterBooksByCategory";

interface SeeAllBooksPros {
  subCategoryId: string;
  categoryId: string;
}

function SeeAllBooks({ subCategoryId, categoryId }: SeeAllBooksPros) {
  const locale = useLocale();
  const booksByCategory = useFilterBooksByCategory({ categoryId });
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
    refetchOnMount:false,
    refetchOnWindowFocus:false
  });

  const bookByCategory = useMemo(() => {
    const data = booksByCategory?.filter(
      (item) => item.subCategory.id === subCategoryId
    );
    return data?.length ? data[0] : null;
  }, [booksByCategory, subCategoryId]);


  const currentCategory=useMemo(()=>{
    return categories?.filter(item=>item.id === categoryId)
  },[categories])
  return (
    <div className="min-h-[250px]">
      <h2 className="text-xl font-medium space-x-2 mb-5">
        {categoryId ? (
          <span>{currentCategory?.[`${locale}CategoryName`]}</span>
        ) : (
          <span>All</span>
        )}
        <span>books</span>
        <span className="text-secondary-foreground font-light">
          ({bookByCategory?.books.length})
        </span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5">
        {bookByCategory?.books.map((book) => (
          <BookItem
            className="text-xs"
            key={book.isbn}
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
