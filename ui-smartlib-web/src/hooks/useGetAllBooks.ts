"use client";

import { useQuery } from "@tanstack/react-query";
import useImagesIndexDb from "./useImagesIndexDb";
import { LoanLibraryInventory } from "@/actions/book-actions";
import { useEffect, useState } from "react";
import { BookItems } from "@/book/domain/models";

interface GetBooksProps {
  limit?: number;
}

export default function useGetAllBooks({ limit }: GetBooksProps) {
  const { getImageByBookId } = useImagesIndexDb();
  const [allBooksWithImages,setAllBooksWithImages]=useState<BookItems[]>([])

  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ALL_BOOKS"],
    queryFn: async () => await LoanLibraryInventory({ limit }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(()=>{
     (async()=>{
      const bookPromises = books?.map(async (book) => ({
        ...book,
        image: await getImageByBookId({id:book?.isbn,image:book?.image}) || book?.image
      }))
      const booksWithImages= await Promise.all(bookPromises)
      setAllBooksWithImages(booksWithImages)
     })()
  },[books])

  console.log('book images',allBooksWithImages)

  return {
    books:allBooksWithImages,
    isLoading,
    error,
  };
}
