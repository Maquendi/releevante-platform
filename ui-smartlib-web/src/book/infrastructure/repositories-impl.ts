import { dbGetAll, dbGetOne } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import {
  Book,
  BookCompartment,
  BookCopy,
  BookEdition,
  BookFilter,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { and, eq } from "drizzle-orm";
import {
  bookCategorySchema,
  bookCopieSchema,
  BookCopySchema,
  bookImageSchema,
  bookSchema,
  categorySchema,
} from "@/config/drizzle/schemas";
import { db } from "@/config/drizzle/db";
import { jsonAgg } from "@/lib/db/helpers";

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
