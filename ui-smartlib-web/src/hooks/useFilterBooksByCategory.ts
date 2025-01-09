"use client";

import { useQuery } from "@tanstack/react-query";
import useSyncImagesIndexDb from "./useImagesIndexDb";
import { FetchAllBookByCategory } from "@/actions/book-actions";



interface FilterBooksByCategoryProps {
  categoryId?: string;
}

export default function useFilterBooksByCategory({
  categoryId,
}: FilterBooksByCategoryProps) {
  const { images } = useSyncImagesIndexDb();

  const { data: booksWithImages =[] } = useQuery({
    queryKey: ["BOOKS_WITH_IMAGES"],
    queryFn: async () => {
      const groupedBooks = await FetchAllBookByCategory()

      return groupedBooks?.map((group: any) => ({
        ...group,
        books: group.books.map((book) => ({
          ...book,
          image: images?.[book.isbn] || book.image,
        })),
      })) || [];
    },
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      if (!categoryId) return data;

      return data
        .map((group) => ({
          subCategory: group.subCategory,
          books: group.books.filter((book) =>
            book.categories.some((category) => category.id === categoryId)
          ),
        }))
        .filter((group) => group.books.length > 0);
    },
  });

  return booksWithImages || [];
}