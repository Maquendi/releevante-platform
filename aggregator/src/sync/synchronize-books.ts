import { dbConnection } from "../config/db.js";
import { executeGet } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { Book, BookCopy, BookImage, Tag } from "../model/client.js";
import { arrayGroupBy } from "../utils.js";

const slid = process.env.slid;

const tagNameMapper: any = {
  vibe: "reading_vibe",
  flavor: "flavor_story_vibe",
  subcategory: "subcategory",
  mood: "mood_vibe",
};

export const synchronizeBooks = async (token: string) => {
  let syncComplete = false;
  let page = 0;
  let totalRecordsSynced = 0;
  let totalBookCopies = 0;
  while (syncComplete == false) {
    try {
      const request: ApiRequest = {
        token,
        resource: `books?page=${page}&size=400&includeTags=true&slid=${slid}&status=not_synced&includeImages=true`,
      };
      const response = await executeGet<Book[]>(request);
      const books = response.context.data;
      page++;
      syncComplete = books?.length == 0 || response.statusCode !== 200;
      if (response.statusCode == 200) {
        if (books && books.length) {
          totalBookCopies += books.length;
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

  console.log("TOTAL BOOK COPIES SYNCHRONIZED: " + totalBookCopies);

  return totalRecordsSynced;
};

const insertCategories = async (books: Book[]): Promise<number> => {
  let bookCategories: Tag[] = [];

  books.forEach((book) => {
    bookCategories = [
      ...bookCategories,
      ...book.tags.filter((tag) => tag.name === "category"),
    ];
  });

  const categories = arrayGroupBy(bookCategories, "id");

  const create_stmt1 = dbConnection.prepare(
    "INSERT INTO category(id, en_name, fr_name, es_name) VALUES (@id, @en_name, @fr_name, @es_name)"
  );

  const update_stmt1 = dbConnection.prepare(
    "UPDATE category SET en_name=?, fr_name=?, es_name=? WHERE id=?"
  );

  let dbChanges = 0;

  Object.keys(categories).forEach((key) => {
    try {
      var tag = categories[key][0];
      dbChanges += create_stmt1.run({
        id: tag.id,
        en_name: tag.value,
        fr_name: tag.valueFr,
        es_name: tag.valueSp,
      }).changes;
    } catch (error: any) {
      dbChanges += update_stmt1.run(
        tag.value,
        tag.valueFr,
        tag.valueSp,
        tag.id
      ).changes;
    }
  });

  const create_stmt2 = dbConnection.prepare(
    "INSERT INTO book_category(id, book_isbn, category_id) VALUES (@id, @book_isbn, @category_id)"
  );

  const update_stmt2 = dbConnection.prepare(
    "UPDATE book_category SET book_isbn=?, category_id=? WHERE id=?"
  );

  bookCategories.forEach((tag) => {
    try {
      dbChanges += create_stmt2.run({
        id: tag.bookTagId,
        book_isbn: tag.isbn,
        category_id: tag.id,
      }).changes;
    } catch (error: any) {
      dbChanges += update_stmt2.run(tag.isbn, tag.id, tag.bookTagId).changes;
    }
  });

  return dbChanges;
};

const insertTags = async (books: Book[]): Promise<number> => {
  let bookTags: Tag[] = [];

  books.forEach((book) => {
    bookTags = [
      ...bookTags,
      ...book.tags.filter((tag) => tag.name !== "category"),
    ];
  });

  const fTags = arrayGroupBy(bookTags, "id");

  const create_stmt1 = dbConnection.prepare(
    "INSERT INTO ftags(id, tag_name, en_tag_value, fr_tag_value, es_tag_value) VALUES (@id, @tag_name, @en_tag_value, @fr_tag_value, @es_tag_value)"
  );

  const update_stmt1 = dbConnection.prepare(
    "UPDATE ftags SET tag_name=?, en_tag_value=?, fr_tag_value=?, es_tag_value=? WHERE id=?"
  );

  let dbChanges = 0;

  Object.keys(fTags).forEach((key) => {
    try {
      var tag = fTags[key][0];
      dbChanges += create_stmt1.run({
        id: tag.id,
        tag_name: tagNameMapper[tag.name] || tag.name,
        en_tag_value: tag.value,
        fr_tag_value: tag.valueFr || tag.value,
        es_tag_value: tag.valueSp || tag.value,
      }).changes;
    } catch (error: any) {
      try {
        dbChanges += update_stmt1.run(
          tagNameMapper[tag.name] || tag.name,
          tag.value,
          tag.valueFr || tag.value,
          tag.valueSp || tag.value,
          tag.id
        ).changes;
      } catch (error: any) {
        console.log("Failed updating tags: " + error.message);
      }
    }
  });

  const create_stmt2 = dbConnection.prepare(
    "INSERT INTO book_ftag(id, book_isbn, ftag_id) VALUES (@id, @book_isbn, @ftag_id)"
  );

  const update_stmt2 = dbConnection.prepare(
    "UPDATE book_ftag SET book_isbn=?, ftag_id=? WHERE id=?"
  );

  bookTags.forEach((tag) => {
    try {
      dbChanges += create_stmt2.run({
        id: tag.bookTagId,
        book_isbn: tag.isbn,
        ftag_id: tag.id,
      }).changes;
    } catch (error: any) {
      dbChanges += update_stmt2.run(tag.isbn, tag.id, tag.bookTagId).changes;
    }
  });

  return dbChanges;
};

const insertBook = async (books: Book[]) => {
  const create_stmt = dbConnection.prepare(
    "INSERT INTO books(id, book_title, correlation_id, edition_title, language, author, description_en, description_fr, description_es, print_length, publicationDate, dimensions, price, public_isbn, publisher, binding_type, created_at, updated_at) VALUES (@id, @book_title, @correlation_id, @edition_title, @language, @author, @description_en, @description_fr, @description_es,  @print_length, @publicationDate, @dimensions, @price, @public_isbn, @publisher, @binding_type, @created_at, @updated_at)"
  );

  const update_stmt = dbConnection.prepare(
    "UPDATE books SET book_title=?, correlation_id=?, edition_title=?, language=?, author=?, description_en=?, description_fr=?, description_es=?, print_length=?, publicationDate=?, dimensions=?, price=?, public_isbn=?, publisher=?, binding_type=?, updated_at=? WHERE id=?"
  );

  let dbChanges = 0;

  books.forEach((book) => {
    try {
      dbChanges += create_stmt.run({
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
        publicationDate: book.publishDate,
        dimensions: book.dimensions,
        price: book.price,
        public_isbn: book.publicIsbn,
        publisher: book.publisher,
        binding_type: book.bindingType,
        created_at: book.createdAt,
        updated_at: book.updatedAt,
      }).changes;
    } catch (error: any) {
      dbChanges += update_stmt.run(
        book.title,
        book.correlationId,
        book.title,
        book.language,
        book.author,
        book.description,
        book.descriptionFr,
        book.descriptionSp,
        book.printLength,
        book.publishDate,
        book.dimensions,
        book.price,
        book.publicIsbn,
        book.publisher,
        book.bindingType,
        book.updatedAt,
        book.isbn
      ).changes;
    }
  });

  return dbChanges;
};

const insertImages = async (books: Book[]) => {
  const create_stmt = dbConnection.prepare(
    "INSERT INTO books_images(id, url, source_url, book_isbn, isSincronized) VALUES (@id, @url, @source_url, @book_isbn, @isSincronized)"
  );

  const update_stmt = dbConnection.prepare(
    "UPDATE books_images SET url=?, source_url=?, book_isbn=?, isSincronized=? WHERE id=?"
  );

  let dbChanges = 0;

  let bookImages: BookImage[] = [];

  books.forEach((book) => {
    bookImages = [...bookImages, ...book.images];
  });

  bookImages.forEach(({ id, isbn, url, sourceUrl }) => {
    try {
      dbChanges += create_stmt.run({
        id: id,
        book_isbn: isbn,
        url: url,
        source_url: sourceUrl,
        isSincronized: 0,
      }).changes;
    } catch (error: any) {
      dbChanges += update_stmt.run(url, sourceUrl, isbn, 0, id).changes;
    }
  });

  return dbChanges;
};

const insertBookCopies = async (books: Book[]) => {
  const create_stmt = dbConnection.prepare(
    "INSERT INTO books_copies(id, book_isbn, is_available, at_position, created_at, updated_at) VALUES (@id, @book_isbn, @is_available, @at_position, @created_at, @updated_at)"
  );

  const update_stmt = dbConnection.prepare(
    "UPDATE books_copies SET book_isbn=?, is_available=?, at_position=?, updated_at=? WHERE id=?"
  );

  let dbChanges = 0;

  let bookCopies: BookCopy[] = [];

  books.forEach((book) => {
    bookCopies = [...bookCopies, ...book.copies];
  });

  bookCopies.forEach((copy) => {
    try {
      dbChanges += create_stmt.run({
        id: copy.id,
        book_isbn: copy.isbn,
        is_available: 1,
        at_position: copy.atPosition,
        created_at: copy.createdAt,
        updated_at: copy.updatedAt,
      }).changes;
    } catch (error: any) {
      dbChanges += update_stmt.run(
        copy.isbn,
        1,
        copy.atPosition,
        copy.updatedAt,
        copy.id
      ).changes;
    }
  });

  return dbChanges;
};
