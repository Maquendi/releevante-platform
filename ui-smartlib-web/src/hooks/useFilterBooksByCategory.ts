"use client";

import { useQuery } from "@tanstack/react-query";
import useSyncImagesIndexDb from "./useSyncImagesIndexDb";
import { useCallback, useEffect, useState } from "react";
import { FetchAllBookByCategory } from "@/actions/book-actions";
import { createUrlFromBlob } from "@/lib/blob-parser";

interface FilterBooksByCategryProps {
  categoryId?: string;
}

export default function useFilterBooksByCategory({
  categoryId,
}: FilterBooksByCategryProps) {
  const { data: groupedBooks } = useQuery({
    queryKey: ["BOOKS_BY_CATEGORIES"],
    queryFn: async () => {
      const data = await FetchAllBookByCategory();
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { getAllBookImages } = useSyncImagesIndexDb();
  const [dataWithImages, setDataWithImages] = useState<any[]>([]);

  const processBooks = useCallback(async () => {
    const allImages = await getAllBookImages();
    if (!groupedBooks) return;

    const imageMap = allImages.reduce((map, { id, image }) => {
      const blobUrl=createUrlFromBlob(image)
      map[id] = blobUrl;
      return map;
    }, {} as Record<string, Blob | null>);

    const updatedGroupedBooks = groupedBooks.map((group: any) => ({
      ...group,
      books: group.books.map((book: any) => ({
        ...book,
        image: imageMap[book.isbn] || null,
      })),
    }));

    setDataWithImages(updatedGroupedBooks);
  }, [groupedBooks]); 

  useEffect(() => {
    processBooks();
  }, [groupedBooks]); 

  if (!categoryId) {
    return dataWithImages;
  }

  const filteredItems = dataWithImages
    ?.map(({ subCategory, books: bookList }) => {
      const filteredBooks = bookList.filter((book) =>
        book.categories.some((category: any) => category.id === categoryId)
      );
      return {
        subCategory,
        books: filteredBooks,
      };
    })
    .filter((item) => item.books.length > 0);

  return filteredItems;
}