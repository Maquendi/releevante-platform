"use client";

import { FetchUnsyncBooksLocal, SyncBookImages } from "@/actions/book-actions";
import { createBlobFromUrl, createUrlFromBlob } from "@/lib/blob-parser";
import {
  getSingleBookFromIndexDb,
  openIndexedDB,
  performDBAction,
  setBookInIndexDb,
} from "@/lib/db/indexDb-client";
import { addImages, setImages } from "@/redux/features/imagesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface BookImage{
  id:string
  image:any
}

export default function useImagesIndexDb() {

  const {cachedImages:currentCachedImages} = useAppSelector(state=>state.cachedImages)
  const dispatch = useAppDispatch()

  const groupImagesToObject=(allImages:BookImage[])=>{
    const imageMap = allImages.reduce((map, { id, image }) => {
      const blobUrl=createUrlFromBlob(image)
      map[id] = blobUrl as any
      return map;
    }, {} as Record<string, string>);
    return imageMap
  }

  const syncBooks = async () => {
    try {
      const books = await FetchUnsyncBooksLocal();

      if (!books || books.length === 0) {
        console.log("No hay libros para sincronizar.");
        return;
      }

      const db = await openIndexedDB();

      const bookImagesToStore= await Promise.all(books.map(async({id,image})=>({
        id,
        image: await createBlobFromUrl(image)
     })))

       const images = groupImagesToObject(bookImagesToStore)
       dispatch(addImages({cachedImages:images}))

      try {
        const bookSyncPromises = bookImagesToStore.map(({id,image}) =>
           performDBAction(db, "put", {
            id,
            image
           })
          )
        await Promise.all(bookSyncPromises);
      } catch (error) {
        console.log("error sync books in index db");
        return;
      }

      //   try {
      //     const imageSyncPromises = books.map((book) => {
      //       if (book?.id) {
      //         return SyncBookImages(book.id);
      //       }
      //     });
      //     await Promise.all(imageSyncPromises);
      //   } catch (error) {
      //     console.log("error sync books database");
      //     return;
      //   }

      console.log("Sincronización completada.");
    } catch (error) {
      console.error("Error durante la sincronización:", error);
    }
  };

  const getAllBookImages = async () => {
    if(currentCachedImages)return  currentCachedImages   
    const db = await openIndexedDB();
    const cachedImages= await performDBAction(db, "getAll");
    const images= groupImagesToObject(cachedImages)
    return images
  };

  useEffect(()=>{
    (async()=>{
      const images = await getAllBookImages()
      dispatch(setImages({cachedImages:images}))
    })()
  },[])

  const getImageByBookId = async (bookId:string) => {
    if(currentCachedImages) {
      return currentCachedImages?.[bookId] || null
    }
    const db = await openIndexedDB();
    const storedImage= await getSingleBookFromIndexDb(db, bookId);

    return await createUrlFromBlob(storedImage.image)
  };

  return {
    syncBooks,
    images:currentCachedImages,
    getAllBookImages,
    getImageByBookId
  };
}
