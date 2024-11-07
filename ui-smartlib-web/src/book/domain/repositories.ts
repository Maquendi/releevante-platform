
import { Book, BookCompartment, BookCopy, BookFilter, Isbn } from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  findBy(filter: BookFilter): Promise<Book>;
  findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  updateCopies(books: BookCopy[]): Promise<BookCopy[]>;
}
