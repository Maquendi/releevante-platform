import {
  Book,
  BookByFtagsVibes,
  BookCategory,
  BookCopy,
  BookImage,
  BookItems,
  BooksByCategory,
  BooksPagination,
  FtagItem,
  FtagsEnum,
  LibraryInventory,
} from "../domain/models";
import { BookCopySearch, BookRatingDto } from "./dto";
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

  async getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]> {
    return await this.bookService.getFtagsByType(tagName)
  }

  async findAvailableCopiesByIsbn(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    return this.bookService.findAvailableCopiesByIsbn(bookSearch);
  }

  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]> {
    return this.bookService.findBooksByVibeTags(tagsValues)
  }

  loanLibraryInventory(): Promise<BookItems[]> {
    return this.bookService.loanLibraryInventory()
  }


 
}
