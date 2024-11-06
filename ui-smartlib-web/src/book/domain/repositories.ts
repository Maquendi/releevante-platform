
import { Book, BookCompartment, BookCopy, Isbn } from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  findBy(bookId: string): Promise<Book>;
  findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  updateCopies(books: BookCopy[]): Promise<BookCopy[]>;
}
