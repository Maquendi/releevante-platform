import { Book, BookByFtagsVibes, BookCategory, BookCopy, BookImage, BookItems, BooksByCategory, BooksPagination, FtagItem, FtagsEnum, IBook, IBookDetail, LibraryInventory, SubCategoryGraph } from "../domain/models";
import { BookCopySearch, BookRatingDto } from "./dto";

export interface BookService {
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(): Promise<BooksByCategory[]>;
  findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]>;
  findAvailableCopiesByIsbnForPurchase(search: BookCopySearch[]): Promise<BookCopy[]>;
  findAvailableCopiesByIsbnForRent(search: BookCopySearch[]): Promise<BookCopy[]>;
  markUnavailable(books: BookCopy[]): Promise<BookCopy[]>;
  findBookById(isbn:string):Promise<Book>
  findByTranslationId(translationId: string): Promise<IBookDetail[]>;
  findAllBooks(params:BooksPagination):Promise<Book[]>
  getFtagsByType(tagName:FtagsEnum):Promise<FtagItem[]>
  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]>
  loanLibraryInventory(): Promise<Book[]>
  loadLibraryInventory(searchCategoryId?: string): Promise<LibraryInventory>
  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategoryGraph>;
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
  loanLibraryInventory(): Promise<Book[]>
  loadLibraryInventory(searchCategoryId?: string): Promise<LibraryInventory>
  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategoryGraph>;
}