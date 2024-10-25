"use client";
import {
  getUnsincronizedImages,
  setUnsincronizedImagesToTrue,
} from "@/actions/image-actions";
import { createBlobFromUrl } from "@/lib/blob-parser";
import { addImagesToBook, getSingleBookFromIndexDb, openIndexedDB, performDBAction } from "@/lib/indexDb-client";


export const handleUpdateImagedIndexDb = async () => {
  try {
    const books = await getUnsincronizedImages();
    if (window === undefined) {
      throw new Error("This script can only run in the client");
    }
    const db = await openIndexedDB();

    const booksWithUnsyncImages = books.filter(
      (book) => book.images.length > 0
    );

    if (!booksWithUnsyncImages?.length) return;

    const transformedData = await Promise.all(
      booksWithUnsyncImages.map(async (items: any) => ({
        id: items.id,
        images: await Promise.all(
          items.images.map(async (image: any) => ({
            id: image.id,
            url: await createBlobFromUrl(image.url),
          }))
        ),
      }))
    );

    await Promise.all(
      transformedData.map(async(book) => {

        const isBookExist= await getSingleBookFromIndexDb(book.id)

        if(isBookExist){
          return addImagesToBook(db,book.id,book.images)
        }
        return performDBAction(db, "put", {
          id: book.id,
          images: book.images,
        });
      })
    );

    const allImages = booksWithUnsyncImages.map((book) => book.images).flat();

    await Promise.all(
      allImages.map((image) => {
        return setUnsincronizedImagesToTrue(image.id);
      })
    );
  } catch (error: any) {
    throw new Error("Error updating images in indexDb" + error);
  }
};
