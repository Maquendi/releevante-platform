import {
  Book,
  BookByFtagsVibes,
  BookCategory,
  BookCopy,
  BookItems,
  BooksByCategory,
  BooksPagination,
  FtagItem,
  FtagsEnum,
  IBook,
  IBookDetail,
  LibraryInventory,
  SubCategoryGraph,
} from "../domain/models";
import { BookCopySearch } from "./dto";
import { BookService, BookServiceFacade } from "./service.definitions";

export class BookServiceFacadeImpl implements BookServiceFacade {
  constructor(private bookService: BookService) {}

  async findAllBookCategory(): Promise<BookCategory[]> {
    return await this.bookService.findAllBookCategory();
  }
  async findAllBookByCategory(): Promise<BooksByCategory[]> {
    return await this.bookService.findAllBookByCategory();
  }
  async findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]> {
    return await this.bookService.findAllBookBySearchCriteria(searchCriteria);
  }
  async findAllBooks(params: BooksPagination): Promise<Book[]> {
    return await this.bookService.findAllBooks(params);
  }
  async findBookById(isbn: string): Promise<Book> {
    return await this.bookService.findBookById(isbn);
  }

  async findByTranslationId(translationId: string): Promise<IBookDetail[]> {
    console.log("loading book details")
    return await this.bookService.findByTranslationId(translationId);
  }

  async getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]> {
    return await this.bookService.getFtagsByType(tagName);
  }

  async findAvailableCopiesByIsbnForPurchase(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    return this.bookService.findAvailableCopiesByIsbnForPurchase(bookSearch);
  }

  async findAvailableCopiesByIsbnForRent(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    return this.bookService.findAvailableCopiesByIsbnForRent(bookSearch);
  }

  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]> {
    return this.bookService.findBooksByVibeTags(tagsValues);
  }

  loanLibraryInventory(): Promise<Book[]> {
    return this.bookService.loanLibraryInventory();
  }

  loadLibraryInventory(categoryId?:string): Promise<LibraryInventory> {
    return this.bookService.loadLibraryInventory(categoryId);
  }

  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategoryGraph> {
    return this.bookService.loadBooksBySubcategory(subcategoryEnValue)
  }
}