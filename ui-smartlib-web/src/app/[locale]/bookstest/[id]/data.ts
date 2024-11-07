'use server'
import { bookSchema } from "@/config/drizzle/schemas/books";
import { dbGetOne } from "@/lib/db/drizzle-client";
import { InferQueryModel } from "@/lib/db/helpers";
import { eq } from "drizzle-orm";

type Book=InferQueryModel<'bookSchema',{
  with: {
    copies: true,
    images: true,
  },
}>

export const getBook=async(id:string):Promise<Book>=>{
    const book = await dbGetOne("bookSchema", {
        where: eq(bookSchema.id, id),
        with: {
          copies: true,
          images: true,
        },
      });
      return book
}