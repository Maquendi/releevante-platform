import { dbConnection } from "../config/db.js";
import { executeGet } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { Book, BookImage } from "../model/client.js";
import { arrayGroupByV2 } from "../utils.js";

const slid = process.env.slid;

export const synchronizeBooks = async (token: string) => {
  let syncComplete = false;
  let page = 0;
  let totalRecordsSynced = 0;
  while (syncComplete == false) {
    const request: ApiRequest = {
      token,
      resource: `aggregator/${slid}/synchronize/books?page=${page}&pageSize=100`,
    };
    const response = await executeGet<Book[]>(request);
    const books = response.context.data;
    page++;
    syncComplete = books?.length == 0 || !books;

    if (books && books.length) {
      totalRecordsSynced += await insertBook(books);
    }
  }

  console.log("TOTAL RECORDS SYNCHRONIZED: " + totalRecordsSynced);

  return totalRecordsSynced;
};

const insertBook = async (books: Book[]) => {
  const groupsByIsbn = arrayGroupByV2(books, (book) => book.isbn);
  const stmt = dbConnection.prepare(
    "INSERT INTO books VALUES (@id, @book_title, @edition_title, @author, @description, @price, @created_at, @updated_at)"
  );

  //console.log(groupsByIsbn)

  const images: BookImage[] = [];

  const bookInsertions = Object.keys(groupsByIsbn).map((key) => {
    const book = groupsByIsbn[key][0];
    images.push(...book.images);
    return new Promise((resolve) => {
      // var insertedBook = stmt.run({
      //   id: book.isbn,
      //   book_title: book.title,
      //   edition_title: book.title,
      //   author: book.author,
      //   description: book.description,
      //   price: book.price,
      //   created_at: new Date().toISOString(),
      //   updated_at: new Date().toISOString(),
      // }).changes;

      return resolve(3);
    });
  });

  await Promise.all(bookInsertions);

  return await insertImages(images);
  //return insertBookCopies(books);
};

const insertImages = async (images: BookImage[]) => {

  const stmt = dbConnection.prepare(
    "INSERT INTO books_images VALUES (@id, @book_isbn, @external_id, @url, @source_url, @isSincronized)"
  );

  var imageInsertions = images.map((image) => {

    console.log(image);
    return new Promise((resolve) => {
      let dbChanges = stmt.run({
        id: image.id,
        book_isbn: image.isbn,
        external_id: image.id,
        url: image.url.trim(),
        source_url: image.sourceUrl.trim(),
        isSincronized: false,
      }).changes;
      resolve(dbChanges);
    });
  });

  await Promise.all(imageInsertions);
  return images.length;
};

const insertBookCopies = async (bookCopies: Book[]) => {
  const stmt = dbConnection.prepare(
    "INSERT INTO books_copies VALUES (@id, @book_isbn, @is_available, @at_position, @created_at, @updated_at)"
  );

  var bookCopyInsertions = bookCopies.map((book) => {
    return new Promise((resolve) => {
      let dbChanges = stmt.run({
        id: book.id,
        book_isbn: book.isbn,
        is_available: true,
        at_position: book.at_position,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).changes;
      resolve(dbChanges);
    });
  });

  await Promise.all(bookCopyInsertions);
  return bookCopies.length;
};
