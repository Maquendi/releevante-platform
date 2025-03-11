"use client";

import { FetchReservedBooks } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import useGetCartBooks from "./useGetCartBooks";
import { ReservationItem } from "@/types/book";

export default function useGetReservedBooks() {
  const { data = { items: [] }, isPending } = useQuery({
    queryKey: ["RESERVATION_BOOKS"],
    queryFn: async () => await FetchReservedBooks(),
  });

  const { rentItems, purchaseItems } = useGetCartBooks(
    data.items as ReservationItem[]
  );
  return {
    rentItems,
    purchaseItems,
    isPending,
  };
}
