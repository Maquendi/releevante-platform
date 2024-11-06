import { dbGetAll, dbPut } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import { Book, BookCompartment, BookCopy, Isbn } from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { and, eq } from "drizzle-orm";
import { bookCopieSchema, BookCopySchema } from "@/config/drizzle/schemas";

class DefaultBookRepositoryImpl implements BookRepository {
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]> {
    throw new Error("Method not implemented.");
  }

  async findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]> {
    const data = dbGetAll("bookCopieSchema", {
      columns: {
        id: true,
        is_available: true,
        at_position: true,
        isbn: true,
      },
      where: and(
        eq(bookCopieSchema.isbn, isbn.value),
        eq(bookCopieSchema.is_available, true)
      ),
    });

    return data.then((results) => results.map((res) => res as BookCopy));
  }

  async updateCopies(bookCopies: BookCopy[]): Promise<BookCopy[]> {
    var resultsPromise = bookCopies.map((book) => {
      return dbPut({
        table: "bookCopieSchema",
        where: { id: book.id },
        values: { is_available: book.is_available },
      });
    });

    return await Promise.all(resultsPromise).then((res) => bookCopies);
  }

  create(book: Book): Promise<Book> {
    throw new Error("Method not implemented.");
  }
  findBy(bookId: string): Promise<Book> {
    throw new Error("Method not implemented.");
  }

  async findCopiesBy(filter: SearchCriteria): Promise<BookCopySchema[]> {
    const conditions = Object.entries(filter.filter).map(([key, value]) => {
      return eq(bookCopieSchema[key as keyof BookCopySchema], value);
    });

    console.log("filter server", filter);

    const whereClause = and(...conditions);

    return dbGetAll("bookCopieSchema", {
      where: whereClause,
      limit: filter?.limit ? filter.limit : 1,
    });
  }
}

export const defaultBookRepository = new DefaultBookRepositoryImpl();
