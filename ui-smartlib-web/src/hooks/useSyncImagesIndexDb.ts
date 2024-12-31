"use client";

import { FetchUnsyncBooksLocal, SyncBookImages } from "@/actions/book-actions";
import { getSingleBookFromIndexDb, openIndexedDB, performDBAction, setBookInIndexDb } from "@/lib/db/indexDb-client";
import { useQuery } from "@tanstack/react-query";

export default function useSyncImagesIndexDb() {
  const syncBooks = async () => {
    try {
      const books = await FetchUnsyncBooksLocal();

      if (!books || books.length === 0) {
        console.log("No hay libros para sincronizar.");
        return;
      }

      const db = await openIndexedDB();

      try {
        const bookSyncPromises = books.map((book) =>
          setBookInIndexDb(db, book)
        );
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

  const getAllBookImages = async ()=>{
    const db = await openIndexedDB();
    return await performDBAction(db,'getAll')
  }

  return {
    syncBooks,
    getAllBookImages
  };
}
