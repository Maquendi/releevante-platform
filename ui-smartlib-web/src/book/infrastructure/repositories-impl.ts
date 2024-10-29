import { dbGetAll } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import { Book, BookCompartment, BookCopy, BookEdition } from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { eq } from "drizzle-orm";
import { bookCopieSchema } from "@/config/drizzle/schemas";

class DefaultBookRepositoryImpl implements BookRepository {


  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]> {
    throw new Error("Method not implemented.");
  }

  
  async findAllBookCopiesAvailable(
    bookEdition: BookEdition
  ): Promise<BookCopy[]> {
    const data = dbGetAll("bookCopieSchema", {
      columns: {
        id: true,
        is_available: true,
        status: true,
      },
      where: eq(bookCopieSchema.edition_id, bookEdition.id),
    });

    return data.then((results) => results.map((res) => res as BookCopy));
  }

  create(book: Book): Promise<Book> {
    throw new Error("Method not implemented.");
  }
  update(book: Book): Promise<Book> {
    throw new Error("Method not implemented.");
  }
  findBy(bookId: string): Promise<Book> {
    throw new Error("Method not implemented.");
  }
  findCopiesBy(search: SearchCriteria): Promise<BookCopy[]> {
    throw new Error("Method not implemented.");
  }
}


export const defaultBookRepository = new DefaultBookRepositoryImpl()
