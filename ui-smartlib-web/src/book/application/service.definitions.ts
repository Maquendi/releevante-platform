import { Book, BookByFtagsVibes, BookCategory, BookCopy, BookImage, BookItems, BooksByCategory, BooksPagination, FtagItem, FtagsEnum, LibraryInventory } from "../domain/models";
import { BookCopySearch, BookRatingDto } from "./dto";

export interface BookService {
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(): Promise<BooksByCategory[]>;
  findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]>;
  findAvailableCopiesByIsbnForPurchase(search: BookCopySearch[]): Promise<BookCopy[]>;
  findAvailableCopiesByIsbnForRent(search: BookCopySearch[]): Promise<BookCopy[]>;
  markUnavailable(books: BookCopy[]): Promise<BookCopy[]>;
  findBookById(isbn:string):Promise<Book>
  findAllBooks(params:BooksPagination):Promise<Book[]>
  getFtagsByType(tagName:FtagsEnum):Promise<FtagItem[]>
  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]>
  loanLibraryInventory(): Promise<BookItems[]>
}


export interface BookServiceFacade {
  findAvailableCopiesByIsbnForPurchase(search: BookCopySearch[]): Promise<BookCopy[]>;
  findAvailableCopiesByIsbnForRent(search: BookCopySearch[]): Promise<BookCopy[]>;
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(): Promise<BooksByCategory[]>;
  findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]>;
  findAllBooks(params:BooksPagination):Promise<Book[]>
  findBookById(isbn:string):Promise<Book>
  getFtagsByType(tagName:FtagsEnum):Promise<FtagItem[]>
  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]>
  loanLibraryInventory(): Promise<BookItems[]>
}