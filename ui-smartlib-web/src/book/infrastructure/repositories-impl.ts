import { dbGetAll, dbPut } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import {
  Book,
  BookCompartment,
  BookCopy,
  BookFilter,
  Isbn,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { and, eq } from "drizzle-orm";
import {
  bookCopieSchema,
  BookCopySchema,
  bookImageSchema,
  bookSchema,
} from "@/config/drizzle/schemas";
import { bookCategorySchema } from "@/config/drizzle/schemas/bookCategory";
import { jsonAgg } from "@/lib/db/helpers";
import { db } from "@/config/drizzle/db";

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
    const resultsPromise = bookCopies.map((book) => {
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

  async findBy(filter: BookFilter): Promise<Book> {
    const queryFilter = and(
      filter?.categoryId
        ? eq(bookCategorySchema.category_id, filter.categoryId)
        : undefined
    );

    const query = db
      .select({
        id: bookSchema.id,
        title: bookSchema.name,
        publisher: bookSchema.author,
        images: jsonAgg({
          id: bookImageSchema.id,
          url: bookImageSchema.url,
        }),
      })
      .from(bookSchema)
      .leftJoin(bookImageSchema, eq(bookImageSchema.book_id, bookSchema.id))
      .where(queryFilter)
      .groupBy(bookSchema.id)
      .$dynamic();

    if (filter?.categoryId)
      query.leftJoin(
        bookCategorySchema,
        eq(bookSchema.id, bookCategorySchema.book_id)
      );

    if (filter?.limit) query.limit(filter.limit);

    const items = await query;
    return new Book(items);
  }

  async findCopiesBy(filter: SearchCriteria): Promise<BookCopySchema[]> {
    const conditions = Object.entries(filter.filter).map(([key, value]) => {
      return eq(bookCopieSchema[key as keyof BookCopySchema], value);
    });

    const whereClause = and(...conditions);

    return dbGetAll("bookCopieSchema", {
      where: whereClause,
      limit: filter?.limit ? filter.limit : 1,
    });
  }
}

export const defaultBookRepository = new DefaultBookRepositoryImpl();
