import { dbConnection } from "../config/db.js";
import { executeGet } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { Book, BookCopy, BookImage, Tag } from "../model/client.js";
import { arrayGroupBy } from "../utils.js";

const slid = process.env.slid;

export const synchronizeBooks = async (token: string) => {
  let syncComplete = false;
  let page = 0;
  let totalRecordsSynced = 0;
  while (syncComplete == false) {
    try {
      const request: ApiRequest = {
        token,
        resource: `books?page=${page}&size=100&includeTags=true&slid=${slid}&status=not_synced&includeImages=true`,
      };
      const response = await executeGet<Book[]>(request);
      const books = response.context.data;
      page++;
      syncComplete = books?.length == 0 || response.statusCode !== 200;
      if (response.statusCode == 200) {
        if (books && books.length) {
          totalRecordsSynced += await insertBook(books);
          totalRecordsSynced += await insertTags(books);
          totalRecordsSynced += await insertImages(books);
          totalRecordsSynced += await insertBookCopies(books);
          totalRecordsSynced += await insertCategories(books);
        }
      } else {
        console.log(
          `failed to load data from server error: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      syncComplete = true;
      console.log(error);
    }
  }

  console.log("TOTAL BOOK RECORDS SYNCHRONIZED: " + totalRecordsSynced);

  return totalRecordsSynced;
};

const insertCategories = async (books: Book[]): Promise<number> => {
  let bookCategories: Tag[] = [];

  books.forEach((book) => {
    bookCategories = [...bookCategories, ...book.categories];
  });

  const categories = arrayGroupBy(bookCategories, "id");

  const stmt1 = dbConnection.prepare(
    "INSERT INTO category VALUES (@id, @en_name, @fr_name, @es_name)"
  );

  let dbChanges = 0;

  Object.keys(categories).forEach((key) => {
    try {
      var tag = categories[key][0];
      dbChanges += stmt1.run({
        id: tag.id,
        en_name: tag.value,
        fr_name: tag.valueFr,
        es_name: tag.valueSp,
      }).changes;
    } catch (error: any) {
      console.log(
        `skipping error in category and continue processing ....${error.message}`
      );
    }
  });

  const stmt2 = dbConnection.prepare(
    "INSERT INTO book_category VALUES (@id, @book_isbn, @category_id)"
  );

  bookCategories.forEach((tag) => {
    try {
      dbChanges += stmt2.run({
        id: tag.bookTagId,
        book_isbn: tag.isbn,
        category_id: tag.id,
      }).changes;
    } catch (error: any) {
      console.log(
        `skipping error in book_category and continue processing ....${error.message}`
      );
    }
  });

  return dbChanges;
};

const insertTags = async (books: Book[]): Promise<number> => {
  let bookTags: Tag[] = [];

  books.forEach((book) => {
    bookTags = [...bookTags, ...book.keyWords, ...book.subCategories];
  });

  const fTags = arrayGroupBy(bookTags, "id");

  const stmt1 = dbConnection.prepare(
    "INSERT INTO ftags VALUES (@id, @tag_name, @en_tag_value, @fr_tag_value, @es_tag_value)"
  );
  let dbChanges = 0;

  Object.keys(fTags).forEach((key) => {
    try {
      var tag = fTags[key][0];
      dbChanges += stmt1.run({
        id: tag.id,
        tag_name: tag.name,
        en_tag_value: tag.value,
        fr_tag_value: tag.valueFr || tag.value,
        es_tag_value: tag.valueSp || tag.value,
      }).changes;
    } catch (error: any) {
      console.log(
        `skipping error in ftags and continue processing ....${error.message}`
      );
    }
  });

  const stmt2 = dbConnection.prepare(
    "INSERT INTO book_ftag VALUES (@id, @book_isbn, @ftag_id)"
  );

  bookTags.forEach((tag) => {
    try {
      dbChanges += stmt2.run({
        id: tag.bookTagId,
        book_isbn: tag.isbn,
        ftag_id: tag.id,
      }).changes;
    } catch (error: any) {
      console.log(
        `skipping error in book_ftag and continue processing ....${error.message}`
      );
    }
  });

  return dbChanges;
};

const insertBook = async (books: Book[]) => {
  const stmt = dbConnection.prepare(
    "INSERT INTO books VALUES (@id, @book_title, @correlation_id, @edition_title, @language, @author, @description_en, @description_fr, @description_es,  @print_length, @publicationDate, @dimensions, @price, @public_isbn, @publisher, @binding_type, @created_at, @updated_at)"
  );
  let dbChanges = 0;

  books.forEach((book) => {
    try {
      dbChanges += stmt.run({
        id: book.isbn,
        book_title: book.title,
        correlation_id: book.correlationId,
        edition_title: book.title,
        language: book.language,
        author: book.author,
        description_en: book.description,
        description_es: book.descriptionSp,
        description_fr: book.descriptionFr,
        print_length: book.printLength,
        publicationDate: book.createdAt,
        dimensions: book.dimensions,
        price: book.price,
        public_isbn: book.publicIsbn,
        publisher: book.publisher,
        binding_type: book.bindingType,
        created_at: book.createdAt,
        updated_at: book.updatedAt,
      }).changes;
    } catch (error: any) {
      console.log(
        `skipping error in insertBook and continue processing ....${error.message}`
      );
    }
  });

  return dbChanges;
};

const insertImages = async (books: Book[]) => {
  const stmt = dbConnection.prepare(
    "INSERT INTO books_images VALUES (@id, @url, @source_url, @book_isbn, @isSincronized)"
  );

  let dbChanges = 0;

  let bookImages: BookImage[] = [];

  books.forEach((book) => {
    bookImages = [...bookImages, ...book.images];
  });

  bookImages.forEach(({ id, isbn, url, sourceUrl }) => {
    try {
      dbChanges += stmt.run({
        id: id,
        book_isbn: isbn,
        url: url,
        source_url: sourceUrl,
        isSincronized: 0,
      }).changes;
    } catch (error: any) {
      console.log(
        `skipping error in insertImages and continue processing ....${error.message}`
      );
    }
  });

  return dbChanges;
};

const insertBookCopies = async (books: Book[]) => {
  const stmt = dbConnection.prepare(
    "INSERT INTO books_copies VALUES (@id, @book_isbn, @is_available, @at_position, @created_at, @updated_at)"
  );

  let dbChanges = 0;

  let bookCopies: BookCopy[] = [];

  books.forEach((book) => {
    bookCopies = [...bookCopies, ...book.copies];
  });

  bookCopies.forEach((copy) => {
    try {
      dbChanges += stmt.run({
        id: copy.id,
        book_isbn: copy.isbn,
        is_available: 1,
        at_position: copy.atPosition,
        created_at: copy.createdAt,
        updated_at: copy.updatedAt,
      }).changes;
    } catch (error: any) {
      console.log(
        `skipping error in insertBookCopies and continue processing ....${error.message}`
      );
    }
  });

  return dbChanges;
};
