import { dbConnection } from "../config/db.js";
import { executeGet } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { Book, BookCopy, BookImage, Tag } from "../model/client.js";
import { arrayGroupByV2 } from "../utils.js";

const slid = process.env.slid;

export const synchronizeBooks = async (token: string) => {
  let syncComplete = false;
  let page = 0;
  let totalRecordsSynced = 0;
  while (syncComplete == false) {
    const request: ApiRequest = {
      token,
      resource: `books?page=${page}&size=10&includeTags=true&slid=${slid}&status=not_synced&includeImages=true`,
    };
    const response = await executeGet<Book[]>(request);
    const books = response.context.data;
    page++;
    syncComplete = books?.length == 0 || !books;

    if (books && books.length) {
      totalRecordsSynced += await insertBook(books);
      totalRecordsSynced += await insertTags(books);
      totalRecordsSynced += await insertImages(books);
      totalRecordsSynced += await insertBookCopies(books);
    }
  }

  console.log("TOTAL BOOK RECORDS SYNCHRONIZED: " + totalRecordsSynced);

  return totalRecordsSynced;
};

const insertTags = async (books: Book[]): Promise<number> => {
  let tags: Tag[] = [];

  books.forEach((book) => {
    tags = [
      ...tags,
      ...book.keyWords,
      ...book.categories,
      ...book.subCategories,
    ];
  });

  const stmt1 = dbConnection.prepare(
    "INSERT INTO ftags VALUES (@id, @tag_name, @en_tag_value, @fr_tag_value, @es_tag_value)"
  );
  let dbChanges = 0;
  tags.forEach((tag) => {
    try {
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

  tags.forEach((tag) => {
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
    "INSERT INTO books VALUES (@id, @book_title,  @correlation_id, @edition_title, @language, @author, @description, @description_sp, @description_fr, @price, @created_at, @updated_at)"
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
        description: book.description,
        description_sp: book.descriptionSp,
        description_fr: book.descriptionFr,
        price: book.price,
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
    "INSERT INTO books_images VALUES (@id, @book_isbn, @url, @source_url, @isSincronized)"
  );

  let dbChanges = 0;

  let bookImages: BookImage[] = [];

  books.forEach((book) => {
    bookImages = [...bookImages, ...book.images];
  });

  console.log(bookImages)

  bookImages.forEach((image) => {
    try {
      dbChanges += stmt.run({
        id: image.id,
        book_isbn: image.isbn,
        url: image.url.trim(),
        source_url: image.sourceUrl.trim(),
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
