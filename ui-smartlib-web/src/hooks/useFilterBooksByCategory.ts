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
  const { getImageByBookId } = useSyncImagesIndexDb();

  const { data: booksByCategory =[],isPending } = useQuery({
    queryKey: ["BOOKS_WITH_IMAGES"],
    queryFn: async () => {
      const groupedBooks = await FetchAllBookByCategory()

      const bookPromises = groupedBooks?.map(async(group) => ({
        ...group,
        books: await Promise.all(group.books.map(async (book) => ({
          ...book,
          image: await getImageByBookId({id:book?.isbn,image:book?.image}) || book?.image
        })),)
      })) 

      return await Promise.all(bookPromises)
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

  return {
     booksByCategory,
     isPending
  }
}
