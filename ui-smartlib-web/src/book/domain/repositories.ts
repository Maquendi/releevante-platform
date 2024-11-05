import { BookCopySchema } from "@/config/drizzle/schemas";
import { SearchCriteria } from "../application/dto";
import { Book, BookCompartment, BookCopy, BookEdition } from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  update(book: Book): Promise<Book>;
  findBy(bookId: string): Promise<Book>;
  findAllBookCopiesAvailable(bookEdition: BookEdition): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  findCopiesBy(filter:SearchCriteria): Promise<BookCopySchema[]>
}
