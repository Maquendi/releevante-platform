import { Book, BookCategory, BookCopy, BookEdition } from "../domain/models";
import { SearchCriteria } from "./dto";

export interface BookService {
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(category: BookCategory): Promise<Book[]>;
  findAllBookCopiesAvailableByEdition(
    bookEdition: BookEdition
  ): Promise<BookCopy[]>;
  findAllBookCopiesAvailableLocallyByEdition(
    bookEdition: BookEdition
  ): Promise<BookCopy[]>;
  findAllBookBySearchCriteria(searchCriteria: SearchCriteria): Promise<Book[]>;

  findBookEdition(edition: { id: string }): Promise<BookEdition>;
}
