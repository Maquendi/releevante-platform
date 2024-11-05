import { BookCopySchema } from "@/config/drizzle/schemas";
import { Book, BookCategory, BookCopy, BookFilter, BookItems } from "../domain/models";

export interface BookService {
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(category: BookCategory): Promise<Book[]>;
  findAllBookCopiesAvailableByEdition(
    bookEdition: BookItems
  ): Promise<BookCopy[]>;
  findAllBookCopiesAvailableLocallyByEdition(
    bookEdition: BookItems
  ): Promise<BookCopy[]>;
  findAllBookBySearchCriteria(searchCriteria: BookFilter): Promise<Book>;
  findBookAvailableCopies(book: { book_id: string,edition_id:string },limit?:number): Promise<BookCopySchema[]>;
}
