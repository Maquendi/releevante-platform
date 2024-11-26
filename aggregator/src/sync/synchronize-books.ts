import { dbConnection } from "../config/db.js";
import { executeGet } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { Book, ClientSyncResponse } from "../model/client.js";
import { arrayGroupBy } from "../utils.js";

const slid = process.env.slid;

export const synchronizeBooks = async () => {
  let syncComplete = false;
  let page = 0;
  let totalRecordsSynced = 0;
  while (syncComplete == false) {
    const request: ApiRequest = {
      resource: `aggregator/${slid}/synchronize/books?page=${page}&pageSize=2`,
    };
    const response = await executeGet<ClientSyncResponse>(request);
    const books = response.context.data.books;
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
  const groupsByIsbn = arrayGroupBy(books, "isbn");
  const stmt = dbConnection.prepare(
    "INSERT INTO books VALUES (@id, @book_title, @edition_title, @author, @description)"
  );
  let insertedBook = 0;

  Object.keys(groupsByIsbn).forEach((key) => {
    const book = groupsByIsbn[key][0];
    insertedBook += stmt.run({
      id: book.isbn,
      book_title: book.title,
      edition_title: book.title,
      author: book.author,
      description: book.description,
    }).changes;
  });

  return insertBookCopies(books);
};

const insertBookCopies = async (books: Book[]) => {
  const stmt = dbConnection.prepare(
    "INSERT INTO books_copies VALUES (@id, @book_isbn, @is_available, @at_position)"
  );

  let dbChanges = 0;

  books.forEach((book) => {
    dbChanges += stmt.run({
      id: book.id,
      book_isbn: book.isbn,
      is_available: true,
      at_position: book.at_position,
    }).changes;
  });

  return dbChanges;
};
