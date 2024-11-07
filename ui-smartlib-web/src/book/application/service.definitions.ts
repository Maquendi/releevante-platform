import { BookCopySchema } from "@/config/drizzle/schemas";
import { Book, BookCategory, BookCopy, BookFilter } from "../domain/models";
import { BookCopySearch, SearchCriteria } from "./dto";

export interface BookService {
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(category: BookCategory): Promise<Book[]>;
  findAllBookBySearchCriteria(searchCriteria: SearchCriteria): Promise<Book[]>;
  findAvailableCopiesByIsbn(search: BookCopySearch[]): Promise<BookCopy[]>;
  markUnavailable(books: BookCopy[]): Promise<BookCopy[]>;
  findCopiesBy(filter:BookFilter):Promise<BookCopySchema[]>
}


export interface BookServiceFacade {
  findAvailableCopiesByIsbn(search: BookCopySearch[]): Promise<BookCopy[]>;
}