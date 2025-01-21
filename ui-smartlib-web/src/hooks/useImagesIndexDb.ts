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

// export default function useImagesIndexDb() {
//   const db = openIndexedDB();

//   const getImageByBookId = async ({ id, image }: BookImage) => {
//     const dbInstance = await db;
//     const storedImage = await getSingleBookFromIndexDb(dbInstance, id);
//     if (!storedImage && navigator.onLine) {
//       await setBookInIndexDb(dbInstance, { id, image });
//     }
//     return  storedImage?.image ? await createUrlFromBlob(storedImage.image) : image
//   };

//   return {
//     getImageByBookId,
//   };
// }

console.log("opening index db connection");
const db = openIndexedDB();

const getImageByBookId = async ({ id, image }: BookImage) => {
  const dbInstance = await db;
  const storedImage = await getSingleBookFromIndexDb(dbInstance, id);
  if (!storedImage && navigator.onLine) {
    await setBookInIndexDb(dbInstance, { id, image });
  }
  return storedImage?.image ? createUrlFromBlob(storedImage.image) : image;
};

export default function useImagesIndexDb() {
  return {
    getImageByBookId,
  };
}
