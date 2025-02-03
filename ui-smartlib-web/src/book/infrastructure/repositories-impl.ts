import { dbGetAll, dbPut } from "@/lib/db/drizzle-client";
import { SearchCriteria } from "../application/dto";
import {
  Book,
  BookByFtagsVibes,
  BookCompartment,
  BookCopy,
  BookRecomendationParams,
  BookRecomendations,
  BooksByCategory,
  BooksPagination,
  CategoryV2,
  FtagItem,
  FtagsEnum,
  IBookDetail,
  Isbn,
  LibraryInventory,
  Paging,
  PartialBook,
  SubCategory,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { and, eq, inArray, like, or, sql, desc } from "drizzle-orm";
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
import { arrayGroupinBy } from "@/lib/utils";

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
        book_isbn: true,
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

  async loanLibraryInventory(): Promise<Book[]> {
    const results = await db
      .select({
        tags: jsonAgg({
          id: ftagsSchema.id,
          esTagValue: ftagsSchema.esTagValue,
          enTagValue: ftagsSchema.enTagValue,
          frTagValue: ftagsSchema.frTagValue,
          tagName: ftagsSchema.tagName,
        }),
        id: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        publisher: bookSchema.author,
        image: bookSchema.image,
        correlationId: bookSchema.correlationId,
        rating: bookSchema.rating,
        votes: bookSchema.votes,
        language: {
          bookId: bookSchema.id,
          language: bookSchema.language,
        },
        bookCopyQty: bookSchema.qty,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .groupBy(bookSchema.id);

    const groupedBooks = results.reduce((acc, book) => {
      if (!book || !book?.correlationId) return acc;
      if (!acc[book.correlationId]) {
        acc[book.correlationId] = {
          ...book,
          languages: [],
          categories: [],
          subCategories: [],
          copies: {},
        };
      }

      if (
        !acc[book.correlationId].languages.some(
          (lang) => lang.language === book.language.language
        )
      ) {
        acc[book.correlationId].languages.push(book.language);
      }

      book.tags.forEach((tag) => {
        if (
          tag.tagName === "category" &&
          !acc[book.correlationId].categories.some(
            (existingTag) => existingTag.id === tag.id
          )
        ) {
          acc[book.correlationId].categories.push(tag);
        }
      });

      book.tags.forEach((tag) => {
        if (
          tag.tagName === "subcategory" &&
          !acc[book.correlationId].subCategories.some(
            (existingTag) => existingTag.id === tag.id
          )
        ) {
          acc[book.correlationId].subCategories.push(tag);
        }
      });

      if (!acc[book.correlationId].copies[book.language.language]) {
        acc[book.correlationId].copies[book.language.language] =
          book.bookCopyQty;
      }

      return acc;
    }, {});

    return Object.values(groupedBooks);
  }

  async loadPartialBooksPaginated(paging?: Paging): Promise<PartialBook[]> {
    const pageSize = paging?.size || 200;
    const currentPage = paging?.page || 0;

    const data = (await db
      .select({
        isbn: bookSchema.id,
        translationId: bookSchema.translationId,
        image: bookSchema.image,
        imageId: bookSchema.imageId,
        rating: bookSchema.rating,
        votes: bookSchema.votes,
        title: bookSchema.bookTitle,
      })
      .from(bookSchema)
      .orderBy(desc(bookSchema.rating))
      .limit(pageSize)
      .offset((currentPage - 1) * pageSize)) as any;

    console.log(
      "PARTIAL BOOKS LOADED ..................... ..................... ....................." +
        data?.length
    );

    return data as PartialBook[];
  }

  extractCategoryAll(categories: CategoryV2[], books: any): CategoryV2 {
    const subCategoryRelations = categories.flatMap(
      (c) => c.subCategoryRelations
    );
    const subCategoriesGrouped = arrayGroupinBy(subCategoryRelations!, "id");
    const subCategories = Object.keys(subCategoriesGrouped).map((key) => {
      const subCategories = subCategoriesGrouped[key];
      const first = subCategories[0];
      const myMap = new Map<string, any>();
      subCategories
        .flatMap((item) => item.bookRelations)
        .forEach((isbn) => {
          if (books[isbn]) {
            myMap.set(isbn, isbn);
          }
        });
      first.bookRelations = Array.from(myMap.values());
      return first;
    });
    return {
      id: "All",
      en: "All",
      fr: "Tous",
      es: "Todas",
      subCategoryRelations: subCategories as any,
    };
  }

  async loadLibraryInventory(): Promise<LibraryInventory> {
    const whereClause = or(
      and(eq(ftagsSchema.tagName, "category")),
      eq(ftagsSchema.tagName, "subcategory")
    );

    const data = await db
      .select({
        isbn: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        translationId: bookSchema.translationId,
        author: bookSchema.author,
        image: bookSchema.image,
        imageId: bookSchema.imageId,
        rating: bookSchema.rating,
        votes: bookSchema.votes,
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

    const categoryMap = new Map<string, Set<any>>();
    const subCategoryMap = new Map<string, Set<any>>();

    const allSubCategories = {
      All: {
        id: "All",
        en: "All",
        fr: "Tous",
        es: "Todas",
      },
    };

    const books = {};

    data.forEach((row) => {
      if (!books[row.isbn]) {
        books[row.isbn] = this.buildPartialBook(row);
      }
      if (row.tagName == "category") {
        const category = categoryMap.get(row.tagId!);
        if (category) {
          category.add(row);
        } else {
          categoryMap.set(row.tagId!, new Set([row]));
        }
      } else {
        allSubCategories[row?.tagId!] = {
          id: row.tagId,
          en: row.enValue,
          fr: row.frValue,
          es: row.esValue,
        };
        const subCategory = subCategoryMap.get(row.tagId!);
        if (subCategory) {
          subCategory.add(row);
        } else {
          subCategoryMap.set(row.tagId!, new Set([row]));
        }
      }
    });

    const bookCategories: CategoryV2[] = [];
    const categoryAll: CategoryV2 = {
      id: "All",
      en: "All",
      fr: "Tous",
      es: "Todas",
      subCategoryRelations: Array.from(subCategoryMap.entries()).map(
        ([key, values]) => {
          var subCategoryId = key;
          var books = Array.from(values.entries()).map(([value]) => value.isbn);
          return {
            id: subCategoryId,
            bookRelations: books,
          };
        }
      ) as any,
    };

    bookCategories.push(categoryAll);

    Array.from(categoryMap.entries()).forEach(
      ([categoryId, categoryValues]) => {
        var sample = categoryValues.values().next().value;
        const categoryBookSet: Set<string> = new Set(
          Array.from(categoryValues.entries()).map(([value]) => value.isbn)
        );
        const subCategoryRelations = Array.from(subCategoryMap.entries())
          .map(([subCategoryId, subCategoryValues]) => {
            const subCategoryBookSet: Set<string> = new Set(
              Array.from(subCategoryValues.entries()).map(
                ([value]) => value.isbn
              )
            );
            const booksRelations = new Set(
              [...subCategoryBookSet].filter((i) => categoryBookSet.has(i))
            );
            return {
              id: subCategoryId,
              bookRelations: Array.from(booksRelations),
            };
          })
          .filter((item) => item.bookRelations.length > 0);

        bookCategories.push({
          id: categoryId,
          en: sample!.enValue,
          fr: sample!.frValue,
          es: sample!.esValue,
          subCategoryRelations: subCategoryRelations as any,
        });
      }
    );

    return {
      categories: bookCategories,
      subCategoryMap: allSubCategories,
      books: books,
    };
  }

  private buildBookDetail(book: any): IBookDetail {
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
      imageId: book.imageId,
      translationId: book.translationId,
      qty: book.qty || 0,
      qtyForSale: book.qtyForSale || 0,
      rating: book.rating || 0,
      votes: book.votes || 0,
      categories: [],
    };
  }

  private buildPartialBook(book: any): PartialBook {
    return {
      isbn: book.isbn,
      title: book.bookTitle,
      author: book.author,
      image: book.image,
      imageId: book.imageId,
      translationId: book.translationId,
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
        image: bookImageSchema.url,
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
      limit: !query ? 20 : undefined,
      columns: {
        id: true,
        bookTitle: true,
        author: true,
        editionTitle: true,
        correlationId: true,
        image: true,
      },
    });

    const filteredBooks = results.reduce((acc, book) => {
      if (!acc[book.correlationId]) {
        acc[book.correlationId] = book;
      }
      return acc;
    }, {});

    return Object.values(filteredBooks);
  }

  async loadBooksBySubcategory(
    subcategoryEnValue: string
  ): Promise<SubCategory> {
    const results = await db
      .select({
        isbn: bookSchema.id,
        translationId: bookSchema.translationId,
        title: bookSchema.editionTitle,
        author: bookSchema.author,
        image: bookSchema.image,
        imageId: bookSchema.imageId,
        tagId: ftagsSchema.id,
        en: ftagsSchema.enTagValue,
        fr: ftagsSchema.frTagValue,
        es: ftagsSchema.esTagValue,
        votes: bookSchema.votes,
        rating: bookSchema.rating,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .where(
        and(
          eq(ftagsSchema.tagName, "subcategory"),
          eq(ftagsSchema.enTagValue, subcategoryEnValue)
        )
      );
    const resultGroup = arrayGroupinBy(results, "isbn");
    const partialBooks: PartialBook[] = Object.keys(resultGroup)
      .map((isbn) =>
        resultGroup[isbn].map((item) => this.buildPartialBook(item))
      )
      .flat();

    const sample = results[0];

    const booksByCategory: SubCategory = {
      en: sample.en!,
      fr: sample.fr!,
      es: sample.es!,
      id: sample.tagId!,
      books: partialBooks,
    };
    return booksByCategory;
  }

  async findByTranslationId(translationId: string): Promise<IBookDetail[]> {
    const results = await db
      .select({
        isbn: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        correlationId: bookSchema.correlationId,
        translationId: bookSchema.translationId,
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
        qty: bookSchema.qty,
        qtyForSale: bookSchema.qty_for_sale,
        image: bookSchema.image,
        imageId: bookSchema.imageId,
        publisher: bookSchema.publisher,
        bindingType: bookSchema.bindingType,
        tagId: ftagsSchema.id,
        tagName: ftagsSchema.tagName,
        en: ftagsSchema.enTagValue,
        fr: ftagsSchema.frTagValue,
        es: ftagsSchema.esTagValue,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .where(
        and(
          eq(bookSchema.translationId, translationId),
          eq(ftagsSchema.tagName, "category")
        )
      )
      .orderBy(bookSchema.id);

    const resultGroup = arrayGroupinBy(results, "isbn");

    return Object.keys(resultGroup).map((isbn) => {
      const categories = resultGroup[isbn].map(({ en, fr, es, tagId }) => ({
        en,
        fr,
        es,
        id: tagId,
      }));

      const bookDetail = this.buildBookDetail(resultGroup[isbn][0]);
      bookDetail.categories = categories;
      return bookDetail;
    });
  }

  async findById(correlationId: string): Promise<Book> {
    const result = await db
      .select({
        id: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        editionTitle: bookSchema.editionTitle,
        correlationId: bookSchema.correlationId,
        author: bookSchema.author,
        publisher: bookSchema.publisher,
        image: bookSchema.image,
        price: bookSchema.price,
        ftags: jsonAgg({
          id: ftagsSchema.id,
          tagName: ftagsSchema.tagName,
          esTagValue: ftagsSchema.esTagValue,
          enTagValue: ftagsSchema.enTagValue,
          frTagValue: ftagsSchema.frTagValue,
        }),
        printLength: bookSchema.printLength,
        enDescription: bookSchema.descriptionEn,
        esDescription: bookSchema.descriptionEs,
        frDescription: bookSchema.descriptionFr,
        publicationDate: bookSchema.publicationDate,
        dimensions: bookSchema.dimensions,
        bookCopyQty: bookSchema.qty,
        qtyForSale: bookSchema.qty_for_sale,
        language: {
          bookId: bookSchema.id,
          name: bookSchema.language,
        },
        rating: bookSchema.rating,
        votes: bookSchema.votes,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .where(eq(bookSchema.correlationId, correlationId))
      .groupBy(bookSchema.id);

    const bookFound = result?.length ? result[0] : null;

    const categories = result?.reduce((acc: any, { ftags }) => {
      ftags.forEach((tag) => {
        if (
          tag.tagName === "category" &&
          !acc.some((item) => item.id === tag.id)
        ) {
          acc.push(tag);
        }
      });
      return acc;
    }, []);

    const languages = result.reduce((acc: any, { id, language }) => {
      if (!acc.some((item) => item.language === language)) {
        acc.push({ bookId: id, language: language.name });
      }
      return acc;
    }, []);

    const copies = result.reduce((acc: any, { bookCopyQty, language }) => {
      if (!acc[language.name]) {
        acc[language.name] = bookCopyQty;
      }
      return acc;
    }, {});

    const bookItem = {
      ...bookFound,
      copies,
      languages,
      categories,
    };

    return bookItem as Book;
  }

  async findByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]> {
    const tagsIdsArr = Object.values(tagsValues);
    const result: any = await db
      .select({
        id: bookSchema.id,
        correlationId: bookSchema.correlationId,
        bookTitle: bookSchema.bookTitle,
        editionTitle: bookSchema.editionTitle,
        author: bookSchema.author,
        publisher: bookSchema.author,
        image: bookSchema.image,
        price: bookSchema.price,
        bookCopyQty: bookSchema.qty,
        qtyForSale: bookSchema.qty_for_sale,
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
        language: {
          bookId: bookSchema.id,
          language: bookSchema.language,
        },
        tagCount: sql`count(${bookFtagSchema.ftagId})`,
        rating: bookSchema.rating,
        votes: bookSchema.votes,
      })
      .from(bookSchema)
      .leftJoin(bookFtagSchema, eq(bookSchema.id, bookFtagSchema.bookIsbn))
      .leftJoin(ftagsSchema, eq(ftagsSchema.id, bookFtagSchema.ftagId))
      .orderBy(sql`count(${bookFtagSchema.ftagId}) DESC`)
      .limit(50)
      .groupBy(bookSchema.id, bookSchema.correlationId)
      .where(inArray(bookFtagSchema.ftagId, tagsIdsArr));

    const groupedBooks = result.reduce((acc, book) => {
      if (!book || !book?.correlationId) return acc;
      if (!acc[book.correlationId]) {
        acc[book.correlationId] = {
          ...book,
          languages: [],
          categories: [],
          copies: {},
        };
      }

      if (
        !acc[book.correlationId].languages.some(
          (lang) => lang.language === book.language.language
        )
      ) {
        acc[book.correlationId].languages.push(book.language);
      }

      book.ftags.forEach((tag) => {
        if (
          tag.tagName === "category" &&
          !acc[book.correlationId].categories.some(
            (existingTag) => existingTag.id === tag.id
          )
        ) {
          acc[book.correlationId].categories.push(tag);
        }
      });

      if (!acc[book.correlationId].copies[book.language.language]) {
        acc[book.correlationId].copies[book.language.language] =
          book.bookCopyQty;
      }

      return acc;
    }, {});

    return Object.values(groupedBooks);
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

  async bookRecomendationsByTags(
    params: BookRecomendationParams
  ): Promise<BookRecomendations> {
    const data = await db
      .select({
        isbn: bookSchema.id,
        translationId: bookSchema.translationId,
        image: bookSchema.image,
        imageId: bookSchema.imageId,
        rating: bookSchema.rating || 0,
        votes: bookSchema.votes || 0,
        title: bookSchema.bookTitle,
        author: bookSchema.author,
      })
      .from(bookSchema)
      .innerJoin(
        bookFtagSchema,
        and(
          eq(bookFtagSchema.bookIsbn, bookSchema.id),
          or(
            eq(bookFtagSchema.ftagId, params.usersCurrentMood),
            eq(bookFtagSchema.ftagId, params.usersReadingPurpose),
            eq(bookFtagSchema.ftagId, params.usersFavFlavorOfStory)
          )
        )
      );

    let mostQualified = [];

    const grouped = arrayGroupinBy(data, "isbn");
    const others: any[] = [];

    Object.keys(grouped).map((isbn) => {
      const currentGroup = grouped[isbn];
      others.push(currentGroup[0]);
      if (mostQualified.length < currentGroup?.length) {
        mostQualified = currentGroup || [];
      }
    });

    const recommended: PartialBook = mostQualified[0];

    const recommendedDetails = await this.findByTranslationId(
      recommended.translationId
    );

    const response = {
      recommended: recommendedDetails[0],
      translations: recommendedDetails,
      others,
    };

    console.log(response);

    return response;
  }
}

export const defaultBookRepository = new DefaultBookRepositoryImpl();
