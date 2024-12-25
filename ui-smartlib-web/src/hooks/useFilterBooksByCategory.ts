"use client";

import { LoanLibraryInventory } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface FilterBooksByCategryProps {
  categoryId?: string;
}
export default function useFilterBooksByCategory({
  categoryId,
}: FilterBooksByCategryProps) {
  const { data: categoryBooks } = useQuery({
    queryKey: ["BOOKS_BY_CATEGORIES"],
    queryFn: () => LoanLibraryInventory(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (!categoryId) {
    return categoryBooks;
  }

  const filteredItems = categoryBooks
    ?.map(({ subCategory, books: bookList }) => {
      const filteredBooks = bookList.filter((book) =>
        book.categories.some((category) => category.id === categoryId)
      );
      return {
        subCategory,
        books: filteredBooks,
      };
    })
    .filter((item) => item.books.length > 0);

  return filteredItems;
}
