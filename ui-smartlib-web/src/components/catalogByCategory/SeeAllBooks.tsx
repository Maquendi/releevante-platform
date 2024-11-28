"use client";

import { FetchAllBookByCategory } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import BookItem from "./BookItem";
import { useLocale } from "next-intl";

interface SeeAllBooksPros {
  subCategoryId: string;
  categoryId: string;
}

function SeeAllBooks({ subCategoryId, categoryId }: SeeAllBooksPros) {
  const locale = useLocale();
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
    <div className="min-h-[250px]">
      <h2 className="text-xl font-medium space-x-2 mb-5">
        {categoryId ? (
          <span>{bookByCategory?.category[`${locale}CategoryName`]}</span>
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
