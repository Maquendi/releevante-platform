import { dbGetAll, dbPut } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import {
  Book,
  BookByFtagsVibes,
  BookCategory,
  BookCompartment,
  BookCopy,
  BooksByCategory,
  BooksPagination,
  CategoryGraph,
  FtagItem,
  FtagsEnum,
  IBook,
  Isbn,
  LibraryInventory,
  SubCategoryGraph,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { and, eq, inArray, like, or, sql } from "drizzle-orm";
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
import { jsonAgg } from "@/lib/db/helpers";
import { serviceRatingsSchema } from "@/config/drizzle/schemas/serviceRating";

class DefaultBookRepositoryImpl implements BookRepository {
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]> {
    throw new Error("Method not implemented." + books);
  }

  async findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]> {
    const data =  dbGetAll("bookCopieSchema", {
      columns: {
        id: true,
        is_available: true,
        at_position: true,
        book_isbn:true
      },
      where: and(
        eq(bookCopieSchema.book_isbn, isbn.value),
        eq(bookCopieSchema.is_available, true)
      ),
    });

    
    return data.then((results) => results.map((res) => res as BookCopy));
  }

  async getFtagsBy(tagName: FtagsEnum): Promise<FtagItem[]> {
    return dbGetAll("ftagsSchema", {
      where: eq(ftagsSchema.tagName, tagName),
    });
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

  // async findAllCategories(): Promise<BookCategory[]> {
  //   return dbGetAll("categorySchema", {
  //     columns: {
  //       id: true,
  //       enName: true,
  //       frName: true,
  //       esName: true,
  //     },
  //   });
  // }

  async loanLibraryInventory(): Promise<BooksByCategory[]> {
    const results = await db
      .select({
        tags: jsonAgg({
          id: ftagsSchema.id,
          esName: ftagsSchema.esTagValue,
          enName: ftagsSchema.enTagValue,
          frName: ftagsSchema.frTagValue,
          tagName: ftagsSchema.tagName,
        }),
        isbn: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        publisher: bookSchema.author,
        imageUrl: bookSchema.image,
        correlationId: bookSchema.correlationId,
        rating: bookSchema.rating,
        votes: bookSchema.votes,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .groupBy(bookSchema.correlationId);

    const groupedBooks: { [key: string]: any } = {};

    results.forEach(({ tags, ...book }) => {
      const subCategoryTags = tags?.filter(
        (tag) => tag.tagName === "subcategory"
      );
      const categoriesTags = tags?.filter((tag) => tag.tagName === "category");

      subCategoryTags.forEach((subCat) => {
        const subCategoryId = subCat.id || "";
        if (!groupedBooks[subCategoryId]) {
          groupedBooks[subCategoryId] = {
            subCategory: subCat,
            books: [],
            bookIds: new Set(),
          };
        }

        if (!groupedBooks[subCategoryId].bookIds.has(book.isbn)) {
          groupedBooks[subCategoryId].books.push({
            ...book,
            categories: categoriesTags,
          });
          groupedBooks[subCategoryId].bookIds.add(book.isbn);
        }
      });
    });

    const data = Object.values(groupedBooks).map(
      ({ bookIds, ...rest }) => rest
    );

    return data as BooksByCategory[];
  }

  async loanLibraryInventoryOriginal(
    searchCategoryId?: string
  ): Promise<LibraryInventory> {
    const whereClause = searchCategoryId
      ? or(
          and(
            eq(ftagsSchema.tagName, "category"),
            eq(ftagsSchema.id, searchCategoryId)
          ),
          eq(ftagsSchema.tagName, "subcategory")
        )
      : or(
          and(eq(ftagsSchema.tagName, "category")),
          eq(ftagsSchema.tagName, "subcategory")
        );

    const data = await db
      .select({
        isbn: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        correlationId: bookSchema.correlationId,
        editionTitle: bookSchema.editionTitle,
        language: bookSchema.language,
        author: bookSchema.author,
        descriptionEn: bookSchema.descriptionEn,
        descriptionFr: bookSchema.descriptionFr,
        descriptionEs: bookSchema.descriptionEs,
        printLength: bookSchema.printLength,
        publicationDate: bookSchema.publicationDate,
        dimensions: bookSchema.dimensions,
        price: bookSchema.price,
        publicIsbn: bookSchema.publicIsbn,
        publisher: bookSchema.publisher,
        bindingType: bookSchema.bindingType,
        image: bookSchema.image,
        tagId: ftagsSchema.id,
        tagName: ftagsSchema.tagName,
        enValue: ftagsSchema.enTagValue,
        frValue: ftagsSchema.frTagValue,
        esValue: ftagsSchema.esTagValue,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .where(whereClause)
      .orderBy(bookSchema.id);

    const groupedByCategoryValue = {};
    const groupedByIsbn = {};
    const books = {};

    data.forEach((item) => {
      let key = item.enValue as string;

      if (!searchCategoryId) {
        if (!books[item.isbn]) {
          books[item.isbn] = this.buildBook(item);
        }
      }

      if (item.tagName == "category") {
        const category = groupedByCategoryValue[key];
        if (category) {
          category.push(item);
        } else {
          groupedByCategoryValue[key] = [item];
        }
      } else {
        key = item.isbn;
        const subCategory = groupedByIsbn[key];
        if (subCategory) {
          subCategory.push(item);
        } else {
          groupedByIsbn[key] = [item];
        }
      }
    });

    const findSubcategories = (isbn: string) => {
      return groupedByIsbn[isbn];
    };

    const categories: CategoryGraph[] = [];

    for (const enValue in groupedByCategoryValue) {
      const booksList = groupedByCategoryValue[enValue];
      const sample = booksList[0];
      const subCategories = {};
      booksList.forEach((book: any) => {
        findSubcategories(book.isbn).forEach((sub: any) => {
          const { enValue, frValue, esValue, tagId, isbn } = sub;
          const subCategory = subCategories[enValue];
          if (subCategory) {
            subCategory.books.push({ isbn });
          } else {
            subCategories[enValue] = {
              id: tagId,
              en: enValue,
              fr: frValue,
              es: esValue,
              books: [{ isbn }],
            };
          }
        });
      });
      const category = {
        id: sample.tagId,
        en: enValue,
        fr: sample.frValue,
        es: sample.esValue,
        subCategories: Object.values(subCategories) as SubCategoryGraph[],
      };

      categories.push(category);
    }

    const bookInventory = {
      inventory: Object.values(books) as IBook[],
      categories,
    };
    return bookInventory;
  }

  private buildBook(book: any): IBook {
    return {
      isbn: book.isbn,
      bookTitle: book.bookTitle,
      correlationId: book.correlationId,
      editionTitle: book.editionTitle,
      language: book.language,
      author: book.author,
      en: book.descriptionEn,
      fr: book.descriptionFr,
      es: book.descriptionEs,
      printLength: book.printLength,
      publicationDate: book.publicationDate,
      dimensions: book.dimensions,
      price: book.price,
      publicIsbn: book.publicIsbn,
      publisher: book.publisher,
      bindingType: book.bindingType,
      image: book.image,
      qty: book.qty || 0,
      rating: book.rating || 0,
      votes: book.votes || 0,
    };
  }

  async findAllByCategory(categoryId?: string): Promise<BooksByCategory[]> {
    const results = await db
      .select({
        category: jsonAgg({
          esCategoryName: categorySchema.esName,
          frCategoryName: categorySchema.frName,
          enCategoryName: categorySchema.enName,
          id: bookCategorySchema.categoryId,
        }),
        subCategory: jsonAgg({
          id: ftagsSchema.id,
          esSubCategoryName: ftagsSchema.esTagValue,
          enSubCategoryName: ftagsSchema.enTagValue,
          frSubCategoryName: ftagsSchema.frTagValue,
        }),
        isbn: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        publisher: bookSchema.author,
        imageUrl: bookImageSchema.url,
        correlationId: bookSchema.correlationId,
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
        and(
          categoryId
            ? eq(bookCategorySchema.categoryId, categoryId)
            : undefined,
          eq(ftagsSchema.tagName, "subcategory")
        )
      )
      .groupBy(bookSchema.correlationId);

    const groupedBooks: { [key: string]: any } = {};

    results.forEach(({ category, subCategory, ...book }) => {
      subCategory?.forEach((subCat) => {
        const subCategoryId = subCat.id || "";
        if (!groupedBooks[subCategoryId]) {
          groupedBooks[subCategoryId] = {
            category,
            subCategory: subCat,
            books: [],
            bookIds: new Set(),
          };
        }

        if (!groupedBooks[subCategoryId].bookIds.has(book.isbn)) {
          groupedBooks[subCategoryId].books.push(book);
          groupedBooks[subCategoryId].bookIds.add(book.isbn);
        }
      });
    });

    const data = Object.values(groupedBooks).map(
      ({ bookIds, ...rest }) => rest
    );

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
        correlationId: true,
        image: true,
      },
    });

    return results as Book[];
  }

  async findById(correlationId: string): Promise<Book> {
    const result: any = await db
      .select({
        id: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        editionTitle: bookSchema.editionTitle,
        author: bookSchema.author,
        publisher: bookSchema.publisher,
        image: bookSchema.image,
        price: bookSchema.price,
        ftags: jsonAgg({
          id: ftagsSchema.id,
          tagName: ftagsSchema.tagName,
          enTagValue: ftagsSchema.enTagValue,
          esTagValue: ftagsSchema.esTagValue,
          frTagValue: ftagsSchema.frTagValue,
        }),
        printLength: bookSchema.printLength,
        enDescription: bookSchema.descriptionEn,
        esDescription: bookSchema.descriptionEs,
        frDescription: bookSchema.descriptionFr,
        publicationDate: bookSchema.publicationDate,
        dimensions: bookSchema.dimensions,
        language: jsonAgg({
          bookId: bookSchema.id,
          language: bookSchema.language,
        }),
        rating: sql<number>`cast(coalesce(avg(${bookRatingsSchema.rating}),0)as int)`,
        votes: sql<number>`cast(coalesce(count(${bookRatingsSchema.rating}),0)as int)`,
      })
      .from(bookSchema)
      .leftJoin(bookRatingsSchema, eq(bookSchema.id, bookRatingsSchema.isbn))
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .groupBy(bookSchema.correlationId)
      .where(eq(bookSchema.correlationId, correlationId));

    const bookFound = result?.length ? result[0] : null;

    const categories = bookFound?.ftags.reduce((acc, tag) => {
      if (
        tag.tagName === "category" &&
        !acc.some((item) => item.id === tag.id)
      ) {
        acc.push(tag);
      }
      return acc;
    }, []);

    const languages = bookFound?.language.reduce(
      (acc: any[], { bookId, language }) => {
        if (!acc.some((item) => item.language === language)) {
          acc.push({ bookId, language });
        }
        return acc;
      },
      []
    );

    const bookItem = {
      ...bookFound,
      languages,
      categories,
    };

    return bookItem as Book;
  }

  async findByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book> {
    const tagsIdsArr = Object.values(tagsValues);
    const result: any = await db
      .select({
        id: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        editionTitle: bookSchema.editionTitle,
        author: bookSchema.author,
        publisher: bookSchema.author,
        image: bookSchema.image,
        price: bookSchema.price,
        ftags: jsonAgg({
          id: ftagsSchema.id,
          tagName: ftagsSchema.tagName,
          enTagValue: ftagsSchema.enTagValue,
          esTagValue: ftagsSchema.esTagValue,
          frTagValue: ftagsSchema.frTagValue,
        }),
        printLength: bookSchema.printLength,
        enDescription: bookSchema.descriptionEn,
        esDescription: bookSchema.descriptionEs,
        frDescription: bookSchema.descriptionFr,
        publicationDate: bookSchema.publicationDate,
        dimensions: bookSchema.dimensions,
        language: jsonAgg({
          bookId: bookSchema.id,
          language: bookSchema.language,
        }),
        tagCount: sql`count(${bookFtagSchema.ftagId})`,
        rating: sql<number>`cast(coalesce(avg(${bookRatingsSchema.rating}),0)as int)`,
        votes: sql<number>`cast(coalesce(count(${bookRatingsSchema.rating}),0)as int)`,
      })
      .from(bookSchema)
      .leftJoin(bookRatingsSchema, eq(bookSchema.id, bookRatingsSchema.isbn))
      .leftJoin(bookFtagSchema, eq(bookSchema.id, bookFtagSchema.bookIsbn))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .groupBy(bookSchema.correlationId)
      .orderBy(sql`count(${bookFtagSchema.ftagId}) DESC`)
      .limit(1)
      .where(
        or(
          eq(ftagsSchema.tagName, "category"),
          inArray(bookFtagSchema.ftagId, tagsIdsArr)
        )
      );

    const bookFound = result?.length ? result[0] : null;
    const languages = bookFound?.language.reduce(
      (acc: any[], { bookId, language }) => {
        if (!acc.some((item) => item.language === language)) {
          acc.push({ bookId, language });
        }
        return acc;
      },
      []
    );

    const categories = bookFound?.ftags.reduce((acc, tag) => {
      if (
        tag.tagName === "category" &&
        !acc.some((item) => item.id === tag.id)
      ) {
        acc.push(tag);
      }
      return acc;
    }, []);

    const bookItem = {
      ...bookFound,
      categories,
      languages,
    };

    return bookItem as Book;
  }

  async findAllBooks(bookFiler: BooksPagination): Promise<Book[]> {
    const { limit = 10, page = 1 } = bookFiler;
    const offset = (page - 1) * limit;

    const results: any = await dbGetAll("bookSchema", {
      columns: {
        isbn: true,
        bookTitle: true,
        author: true,
        image: true,
        editionTitle: true,
        correlationId: true,
      },
      limit,
      offset,
    });

    return results;
  }


 
}

export const defaultBookRepository = new DefaultBookRepositoryImpl();
