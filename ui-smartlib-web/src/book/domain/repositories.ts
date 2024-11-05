import { BookCopySchema } from "@/config/drizzle/schemas";
import { SearchCriteria } from "../application/dto";
import { Book, BookCompartment, BookCopy,BookFilter, BookItems } from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  update(book: Book): Promise<Book>;
  findBy(filter: BookFilter): Promise<Book>;
  findAllBookCopiesAvailable(bookEdition: BookItems): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  findCopiesBy(filter:SearchCriteria): Promise<BookCopySchema[]>
}
