"use client";

import { useQuery } from "@tanstack/react-query";
import useImagesIndexDb from "./useImagesIndexDb";
import { LoanLibraryInventory } from "@/actions/book-actions";

interface GetBooksProps {
  limit?: number;
}

export default function useGetAllBooks({ limit }: GetBooksProps) {
  const { images } = useImagesIndexDb();

  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ALL_BOOKS"],
    queryFn: async () => await LoanLibraryInventory({ limit }),
    staleTime: 5 * 60 * 1000,
    select(books) {
      return (
        books?.map((book) => ({
          ...book,
          image: images?.[book?.isbn] || book?.image,
        })) || []
      );
    },
  });

  return {
    books,
    isLoading,
    error,
  };
}
