"use client";

import { useQuery } from "@tanstack/react-query";
import useImagesIndexDb from "./useImagesIndexDb";
import { LoanLibraryInventory } from "@/actions/book-actions";
import { useEffect, useState } from "react";
import { Book, BookItems } from "@/book/domain/models";



export default function useGetAllBooks() {
  const { getImageByBookId } = useImagesIndexDb();
  const [allBooksWithImages,setAllBooksWithImages]=useState<Book[]>([])
  const [isPending,setIsPending]=useState(true)
  const {
    data: books = [],
    error,
  } = useQuery({
    queryKey: ["ALL_BOOKS"],
    queryFn: async () => await LoanLibraryInventory({}),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(()=>{
    setIsPending(true);
     (async()=>{
      const bookPromises = books?.map(async (book) => ({
        ...book,
        image: await getImageByBookId({id:book?.id,image:book?.image}) || book?.image
      }))
      const booksWithImages= await Promise.all(bookPromises)
      setAllBooksWithImages(booksWithImages)
      setIsPending(false)
     })()
  },[books])


  return {
    books:allBooksWithImages,
    isPending,
    error,
  };
}
