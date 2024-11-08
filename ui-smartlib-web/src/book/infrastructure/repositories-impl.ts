import { dbGetAll, dbGetOne, dbPut } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import {
  Book,
  BookCategory,
  BookCompartment,
  BookCopy,
  BookImage,
  BooksPagination,
  CategoryBooks,
  Isbn,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { and, eq, ilike, like, or } from "drizzle-orm";
import {
  bookCopieSchema,
  BookCopySchema,
  bookImageSchema,
  bookSchema,
  categorySchema,
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

  async findAllByCategory(categoryId: string): Promise<CategoryBooks> {
    const results = await db
      .select({
        categoryName: categorySchema.name,
        isbn: bookSchema.isbn,
        bookTitle: bookSchema.book_title,
        publisher: bookSchema.author,
        editionTitle: bookSchema.edition_title,
        images: jsonAgg({
          id: bookImageSchema.id,
          url: bookImageSchema.url,
        }),
      })
      .from(bookSchema)
      .leftJoin(bookImageSchema, eq(bookImageSchema.book_isbn, bookSchema.isbn))
      .leftJoin(
        bookCategorySchema,
        eq(bookSchema.isbn, bookCategorySchema.book_isbn)
      )
      .leftJoin(
        categorySchema,
        eq(categorySchema.id, bookCategorySchema.category_id)
      )
      .where(eq(bookCategorySchema.category_id, categoryId))
      .groupBy(bookSchema.isbn);

    const transformedData = results.reduce<{
      categoryName: string;
      books: Book[];
    }>(
      (acc, { categoryName, ...book }) => {
        if (!acc.categoryName) acc.categoryName = categoryName!;
        acc.books.push(book as Book);
        return acc;
      },
      { categoryName: "", books: [] }
    );

    return transformedData;
  }

  async findAllCategories(): Promise<BookCategory[]> {
    return dbGetAll("categorySchema", {
      columns: {
        id: true,
        name: true,
        image: true,
      },
    });
  }

  async findAllBy(query: string): Promise<Book[]> {
    const results = await dbGetAll("bookSchema", {
      where: or(
        like(bookSchema.book_title, `%${query}%`),
        like(bookSchema.author, `%${query}%`),
        like(bookSchema.edition_title, `%${query}%`)
      ),
      columns: {
        isbn: true,
        book_title: true,
        author: true,
        edition_title: true,
      },
    });

    const formattedResults = results.map(
      ({ isbn, book_title, author, edition_title }) => ({
        isbn: isbn,
        bookTitle: book_title,
        publisher: author,
        editionTitle: edition_title,
      })
    );

    return formattedResults as Book[];
  }

  async findById(isbn: string): Promise<Book> {
    const result: any = await dbGetOne("bookSchema", {
      where: eq(bookSchema.isbn, isbn),
      columns: {
        isbn: true,
        book_title: true,
        author: true,
        edition_title: true,
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

    const formattedResult: Book = {
      isbn: result.isbn,
      bookTitle: result.book_title,
      publisher: result.author,
      editionTitle: result.edition_title,
      images: result.images,
    };

    return formattedResult;
  }

  async findAllBooks(bookFiler: BooksPagination): Promise<Book[]> {
    const { limit = 10, page = 1 } = bookFiler;
    const offset = (page - 1) * limit;

    const results: any = await dbGetAll("bookSchema", {
      columns: {
        isbn: true,
        book_title: true,
        author: true,
        edition_title: true,
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

    const formattedResults: Book[] = results.map(
      ({ isbn, book_title, author, edition_title, images }) => ({
        isbn: isbn,
        bookTitle: book_title,
        publisher: author,
        editionTitle: edition_title,
        images,
      })
    );

    return formattedResults;
  }
}

export const defaultBookRepository = new DefaultBookRepositoryImpl();
