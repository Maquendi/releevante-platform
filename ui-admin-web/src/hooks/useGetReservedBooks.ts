"use client";

import {
  FetchAllBookCategories,
  FetchAllBooksByOrg,
  FetchReservedBooks,
} from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import useGetCartBooks from "./useGetCartBooks";
import { useMemo } from "react";

export default function useGetReservedBooks() {
  const { data: reservedData, isPending: isLoadingReservations } = useQuery({
    queryKey: ["RESERVATION_BOOKS"],
    queryFn: async() => await FetchReservedBooks(),
  });

  const { data: books, isPending: isLoadingBooks } = useQuery({
    queryKey: ["LIBRARY_INVENTORY"],
    queryFn: async()=>await FetchAllBooksByOrg(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoriesData, isPending: isLoadingCategories } = useQuery({
    queryKey: ["BOOK_CATEGORIES"],
    queryFn: async ()=>await FetchAllBookCategories(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const isPending = isLoadingReservations || isLoadingBooks || isLoadingCategories;

  const bookCategories = (isbn: string) => {
    if (!categoriesData?.categories) return [];

    return categoriesData.categories
      .filter(
        (item) =>
          item.subCategoryRelations
            .flatMap((subCat) => subCat.bookRelations)
            .includes(isbn) && item.en !== "All"
      )
      .map(({ id, en, fr, es }) => ({ id, en, fr, es }));
  };


  const itemsMap = useMemo(() => {
    if (!books || !reservedData) return [];

    const allReservedItems = reservedData.flatMap((item) => item.items) || [];

    return allReservedItems.map((cartItem) => ({
      ...cartItem,
      ...(books[cartItem.isbn as keyof unknown] as any || {}), 
      categories: bookCategories(cartItem.isbn),
    }));
  }, [reservedData, books, categoriesData]);

  const { rentItems, purchaseItems } = useGetCartBooks(itemsMap);
  return {
    rentItems,
    purchaseItems,
    isPending, 
  };
}
