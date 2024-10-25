"use client";

import {
  getUnsincronizedImages,
  setUnsincronizedImagesToTrue,
} from "@/actions/image-actions";
import { createBlobFromUrl } from "@/lib/blob-parser";
import {
  addImagesToBook,
  getSingleBookFromIndexDb,
  openIndexedDB,
  performDBAction,
} from "@/lib/indexDb-client";

type BookData = {
  id: string;
  images: {
    id: number;
    url:any
  }[];
};

export const handleUpdateImagedIndexDb = async (): Promise<void> => {
  try {
    const books = await getUnsincronizedImages();
    if (!window) throw new Error("This script can only run in the client");

    const booksWithUnsyncImages = filterBooksWithImages(books);
    if (!booksWithUnsyncImages.length) return;

    const db: IDBDatabase = await openIndexedDB();

    const imagesTransformedToBlob = await transformImagesToBlob(booksWithUnsyncImages);

    const dbUpdatePromises = prepareDbUpdatePromises(db, imagesTransformedToBlob);
    await Promise.all(dbUpdatePromises);

    const syncUpdatePromises = prepareSyncUpdatePromises(booksWithUnsyncImages);
    await Promise.all(syncUpdatePromises);

  } catch (err:any) {
  }
};

const filterBooksWithImages = (books: BookData[]): BookData[] => {
  return books.filter((book) => (book.images.length ?? 0) > 0);
};

const transformImagesToBlob = async (booksWithUnsyncImages: BookData[]): Promise<BookData[]> => {
  return await Promise.all(
    booksWithUnsyncImages.map(async (items) => ({
      id: items.id,
      images: await Promise.all(
        items.images.map(async (image) => ({
          id: image.id,
          url: await createBlobFromUrl(image.url),
        }))
      ),
    }))
  );
};

const prepareDbUpdatePromises = (db: IDBDatabase, imagesTransformedToBlob: BookData[]): Promise<void>[] => {
  return imagesTransformedToBlob.map(async (book) => {
    const isBookExist = await getSingleBookFromIndexDb(db, book.id);

    if (isBookExist) {
      const existingImages = isBookExist.images.map((img) => img.id);
      const newImages = book.images.filter((image) => !existingImages.includes(image.id));
      return addImagesToBook(db, book.id, newImages);
    }

    return performDBAction(db, "put", {
      id: book.id,
      images: book.images,
    });
  });
};

const prepareSyncUpdatePromises = (booksWithUnsyncImages: BookData[] | any): Promise<void>[] => {
  const allImages = booksWithUnsyncImages.flatMap((book) => book.images);
  return allImages.map((image) => setUnsincronizedImagesToTrue(image.id));
};
