import BookDetailsPage from "@/components/BookDetailsPage";
import { db } from "@/config/drizzle/db";
import { books } from "@/config/drizzle/schemas";
import { eq } from "drizzle-orm";

export default async function BookDetailsTest({ params }: any) {
  const book = await db.query.books.findFirst({
    where: eq(books.id, params.id),
    with: {
      images: {
        with:{
          edition:true
        }
      },
    },
  });


  return <BookDetailsPage book={book} />;
}
