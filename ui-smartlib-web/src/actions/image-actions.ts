"use server";
import { books_images_schema } from "@/config/drizzle/schemas";
import { dbGetAll, dbPut } from "@/lib/drizzle-client";
import { eq } from "drizzle-orm";

type Images={
    id:string,
    images:{
        id:number,
        url:string
    }[]
}

export const getUnsincronizedImages = async ():Promise<Images[]> => {
  const unsyncronizedImages = await dbGetAll("books_images_schema", {
    columns: {
      id: true,
      url: true,
      book_id: true,
    },
    where: eq(books_images_schema.isSincronized, false),
  });

  const groupedImagesBybookId = unsyncronizedImages.reduce((acc, image) => {
    if (!acc[image.book_id]) {
      acc[image.book_id] = {
        id: image.book_id,
        images: [],
      };
    }
    acc[image.book_id].images.push(image);
    return acc;
  }, {});

  return Object.values(groupedImagesBybookId) 
};

export const setUnsincronizedImagesToTrue = (image_id: number) => {
  return dbPut("books_images_schema", image_id, { isSincronized: true });
};
