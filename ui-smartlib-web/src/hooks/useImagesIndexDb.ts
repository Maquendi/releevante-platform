"use client";

import { createUrlFromBlob } from "@/lib/blob-parser";
import {
  getSingleBookFromIndexDb,
  openIndexedDB,
  setBookInIndexDb,
} from "@/lib/db/indexDb-client";

interface BookImage {
  id: string;
  image: any;
}

export default function useImagesIndexDb() {
  if (typeof window === "undefined") {
    return {
      getImageByBookId: async ({ id, image }: BookImage) => {
        return image;
      },
    };
  }

  const dbPromise = openIndexedDB();

  const getImageByBookId = async ({ id, image }: BookImage) => {
    const dbInstance = await dbPromise;
    const storedImage = await getSingleBookFromIndexDb(dbInstance, id);
    if (!storedImage && navigator.onLine) {
      await setBookInIndexDb(dbInstance, { id, image });
    }
    return storedImage?.image
      ? await createUrlFromBlob(storedImage.image)
      : image;
  };

  return {
    getImageByBookId,
  };
}
