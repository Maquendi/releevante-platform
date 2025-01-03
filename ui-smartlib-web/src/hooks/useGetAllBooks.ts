"use client";

import { useQuery } from "@tanstack/react-query";
import useSyncImagesIndexDb from "./useSyncImagesIndexDb";
import { LoanLibraryInventory } from "@/actions/book-actions";


interface GetBooksProps {
  limit?: number;
}

export default function useGetAllBooks({ limit }: GetBooksProps) {
  const { getAllBookImages } = useSyncImagesIndexDb();

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ["ALL_BOOKS"],
    queryFn: async () => {
      const [books, images] = await Promise.all([
        LoanLibraryInventory({ limit }),
        getAllBookImages()
      ]);

      return books?.map((book) => ({
        ...book,
        image: images?.[book.isbn] || null
      })) || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    books,
    isLoading,
    error
  };
}