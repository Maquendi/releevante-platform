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
import { and, eq, inArray, like, or } from "drizzle-orm";
import {
  bookCopieSchema,
  BookCopySchema,
  bookFtagSchema,
  bookImageSchema,
  bookSchema,
  ftagsSchema,
} from "@/config/drizzle/schemas";
import { jsonAgg } from "@/lib/db/helpers";
import { db } from "@/config/drizzle/db";
import { bookCategorySchema } from "@/config/drizzle/schemas/bookCategory";

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
    return dbGetAll('categorySchema',{
      columns:{
        id:true,
        name:true
      }
    })    
  }

  async findAllByCategory(categoryId: string): Promise<BooksByCategory[]> {
    const results=await db
      .select({
        subCategory: ftagsSchema.tagValue,
        books: jsonAgg({
          isbn: bookSchema.isbn,
          bookTitle: bookSchema.bookTitle,
          publisher: bookSchema.author,
          imageUrl: bookImageSchema.url,
        }),
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.isbn))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .leftJoin(bookImageSchema, eq(bookImageSchema.book_isbn, bookSchema.isbn))
      .leftJoin(
        bookCategorySchema,
        eq(bookCategorySchema.bookIsbn, bookSchema.isbn)
      )
      .where(and(eq(bookCategorySchema.categoryId, categoryId)))
      .groupBy(ftagsSchema.tagValue);
      
      return results as BooksByCategory[]
  }

  async findAllBy(query: string): Promise<Book[]> {
    const results = await dbGetAll("bookSchema", {
      where: or(
        like(bookSchema.bookTitle, `%${query}%`),
        like(bookSchema.author, `%${query}%`),
        like(bookSchema.editionTitle, `%${query}%`)
      ),
      columns: {
        isbn: true,
        bookTitle: true,
        author: true,
        editionTitle: true,
      },
    });

    return results as Book[];
  }

  async findById(isbn: string): Promise<Book> {
    const result: any = await dbGetOne("bookSchema", {
      where: eq(bookSchema.isbn, isbn),
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
