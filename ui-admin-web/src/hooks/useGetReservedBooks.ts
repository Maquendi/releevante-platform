"use client";

import {
  FetchAllBookCategories,
  FetchAllBooksByOrg,
  FetchReservedBooks,
} from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import useGetCartBooks from "./useGetCartBooks";
import { useCallback, useEffect, useState } from "react";
import { ReservationItem, ReservedItemType } from "@/types/book";

export default function useGetReservedBooks() {
  const [resevedBooks, setReservedBooks] = useState<ReservationItem[]>([]);
  const [modifiedBooks,setModifiedBooks]=useState<ReservationItem[]>([])
  const { data: reservedData, isPending: isLoadingReservations } = useQuery({
    queryKey: ["RESERVATION_BOOKS"],
    queryFn: async () => await FetchReservedBooks(),
  });

  const { data: books, isPending: isLoadingBooks } = useQuery({
    queryKey: ["LIBRARY_INVENTORY"],
    queryFn: async () => await FetchAllBooksByOrg(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoriesData, isPending: isLoadingCategories } = useQuery({
    queryKey: ["BOOK_CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const isPending =
    isLoadingReservations || isLoadingBooks || isLoadingCategories;

  const bookCategories = useCallback(
    (isbn: string) => {
      if (!categoriesData?.categories) return [];

      return categoriesData.categories
        .filter(
          (item) =>
            item.subCategoryRelations
              .flatMap((subCat) => subCat.bookRelations)
              .includes(isbn) && item.en !== "All"
        )
        .map(({ id, en, fr, es }) => ({ id, en, fr, es }));
    },
    [categoriesData]
  );

  const getReservedBooksMap = useCallback(() => {
    if (!books || !reservedData) return [];

    return reservedData.items.map((cartItem) => ({
      ...cartItem,
      ...((books[cartItem.isbn as keyof unknown] as any) || {}),
      id:cartItem.id,
      categories: bookCategories(cartItem.isbn),
    }));
  }, [bookCategories, books, reservedData]);

  useEffect(() => {
    const allItems = getReservedBooksMap();
    setReservedBooks(allItems);
  }, [
    reservedData,
    books,
    categoriesData,
    bookCategories,
    getReservedBooksMap,
  ]);

  useEffect(() => {
    const modifiedItems= resevedBooks.filter(originalItem => {
      const modifiedItem = reservedData?.items.find(item => item.id === originalItem.id);
      if (!modifiedItem) return false;
      return (
        modifiedItem.transactionType !== originalItem.transactionType ||
        modifiedItem.qty !== originalItem.qty
      );
    });
    setModifiedBooks(modifiedItems)
  }, [resevedBooks, reservedData]);
  

  const { rentItems, purchaseItems } = useGetCartBooks(resevedBooks.filter(item=>item.qty > 0));

  const handleMoveBook = (id: string, type: ReservedItemType) => {
    const transactionType =
      type === "RENT" ? "PURCHASE" : ("RENT" as ReservedItemType);
    const updatedItems = resevedBooks?.map((item) =>
      item.id === id ? { ...item, transactionType } : item
    );
    setReservedBooks(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = resevedBooks?.map((item) =>
      item.id === id ? { ...item, qty: 0 } : item
    );
    setReservedBooks(updatedItems);
  };

  const handleResetModified = () => {
    const items = getReservedBooksMap();
    setReservedBooks(items);
  };

  const reservationId = reservedData ? reservedData?.id : null 

  const handleClearModifyItems = () => {
    setModifiedBooks([]);
  };

  return {
    rentItems,
    purchaseItems,
    isPending,
    modifiedBooks,
    handleMoveBook,
    handleRemoveItem,
    handleResetModified,
    reservationId,
    handleClearModifyItems
  };
}
