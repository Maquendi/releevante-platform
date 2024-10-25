import {  createUrlFromBlob } from "@/lib/blob-parser";
import { openIndexedDB, performDBAction } from "@/lib/indexDb-client";

export const fetchBookImages = async ({
  book_id,
}: {
  book_id: string;
}): Promise<any> => {
  try {
    const db = await openIndexedDB();
    const bookStored = await performDBAction(db, "get", null, book_id);
    if(!bookStored)return[]
    const allImages = await Promise.all(
      bookStored?.images.map(async (image: any) => ({
        id: image.id,
        url: createUrlFromBlob(image.url),
      }))
    );
    return allImages;
  } catch (error: any) {
    throw new Error("Error getting books from indexDb" + error);
  }
};


