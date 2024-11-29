import { dbGetAll, dbGetOne, dbPut } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import {
  Book,
  BookCategory,
  BookCompartment,
  BookCopy,
  BooksByCategory,
  BooksPagination,
  Isbn,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { and, avg, eq, like, or, sql } from "drizzle-orm";
import {
  bookCopieSchema,
  BookCopySchema,
  bookFtagSchema,
  bookImageSchema,
  bookSchema,
  categorySchema,
  ftagsSchema,
} from "@/config/drizzle/schemas";
import { db } from "@/config/drizzle/db";
import { bookCategorySchema } from "@/config/drizzle/schemas/bookCategory";
import { bookRatingsSchema } from "@/config/drizzle/schemas/bookRatings";
import { da } from "@faker-js/faker";

class DefaultBookRepositoryImpl implements BookRepository {
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]> {
    throw new Error("Method not implemented." + books);
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
        eq(bookCopieSchema.book_isbn, isbn.value),
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

    return await Promise.all(resultsPromise).then(() => bookCopies);
  }

  create(book: Book): Promise<Book> {
    throw new Error("Method not implemented." + book.bookTitle);
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

  async findAllCategories(): Promise<BookCategory[]> {
    return dbGetAll("categorySchema", {
      columns: {
        id: true,
        enName: true,
        frName: true,
        esName: true,
      },
    });
  }

  async findAllByCategory(categoryId?: string): Promise<BooksByCategory[]> {
    const results = await db
      .select({
        category: {
          esCategoryName: categorySchema.esName,
          frCategoryName: categorySchema.frName,
          enCategoryName: categorySchema.enName,
          id: bookCategorySchema.categoryId,
        },
        subCategory: {
          id: ftagsSchema.id,
          esSubCategoryName: ftagsSchema.esTagValue,
          enSubCategoryName: ftagsSchema.enTagValue,
          frSubCategoryName: ftagsSchema.frTagValue,
        },
        isbn: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        publisher: bookSchema.author,
        imageUrl: bookImageSchema.url,
        rating: sql<number>`cast(coalesce(avg(${bookRatingsSchema.rating}),0)as int)`,
        votes: sql<number>`cast(coalesce(count(${bookRatingsSchema.rating}),0)as int)`,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .leftJoin(bookImageSchema, eq(bookImageSchema.book_isbn, bookSchema.id))
      .leftJoin(bookRatingsSchema, eq(bookRatingsSchema.isbn, bookSchema.id))
      .leftJoin(
        bookCategorySchema,
        eq(bookCategorySchema.bookIsbn, bookSchema.id)
      )
      .leftJoin(
        categorySchema,
        eq(categorySchema.id, bookCategorySchema.categoryId)
      )
      .where(
        categoryId ? eq(bookCategorySchema.categoryId, categoryId) : undefined
      )
      .groupBy(bookSchema.id);

    const groupedBooks = results.reduce(
      (acc, { category, subCategory, ...book }) => {
        if (!acc[subCategory!.id]) {
          acc[subCategory!.id] = {
            category,
            subCategory,
            books: [],
          };
        }
        acc[subCategory!.id].books.push(book);
        return acc;
      },
      {}
    );

    const data = Object.values(groupedBooks);

    return data as BooksByCategory[];
  }

  async findAllBy(query: string): Promise<Book[]> {
    const results = await dbGetAll("bookSchema", {
      where: or(
        like(bookSchema.bookTitle, `%${query}%`),
        like(bookSchema.author, `%${query}%`),
        like(bookSchema.editionTitle, `%${query}%`)
      ),
      columns: {
        id: true,
        bookTitle: true,
        author: true,
        editionTitle: true,
      },
      with:{
        images:{
          columns:{
            id:true,
            url:true
          }
        }
      }
    });

    return results as Book[];
  }

  async findById(isbn: string): Promise<Book> {
    const result: any = await dbGetOne("bookSchema", {
      where: eq(bookSchema.id, isbn),
      columns: {
        isbn: true,
        bookTitle: true,
        author: true,
        editionTitle: true,
      },
      with: {
        images: {
          columns: {
            id: true,
            url: true,
          },
        },
      },
    });

    return result;
  }

  async findAllBooks(bookFiler: BooksPagination): Promise<Book[]> {
    const { limit = 10, page = 1 } = bookFiler;
    const offset = (page - 1) * limit;

    const results: any = await dbGetAll("bookSchema", {
      columns: {
        isbn: true,
        bookTitle: true,
        author: true,
        editionTitle: true,
      },
      with: {
        images: {
          columns: {
            id: true,
            url: true,
          },
        },
      },
      limit,
      offset,
    });

    return results;
  }
}

export const defaultBookRepository = new DefaultBookRepositoryImpl();
