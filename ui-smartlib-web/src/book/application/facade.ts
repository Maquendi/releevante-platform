import {
  Book,
  BookCategory,
  BookCopy,
  BooksByCategory,
  BooksPagination,
} from "../domain/models";
import { BookCopySearch } from "./dto";
import { BookService, BookServiceFacade } from "./service.definitions";

 export class BookServiceFacadeImpl implements BookServiceFacade {
  constructor(private bookService: BookService) {}
  async findAllBookCategory(): Promise<BookCategory[]> {
    return await this.bookService.findAllBookCategory();
  }
  async findAllBookByCategory(categoryId: string): Promise<BooksByCategory[]> {
    return await this.bookService.findAllBookByCategory(categoryId);
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

  async findAvailableCopiesByIsbn(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    return this.bookService.findAvailableCopiesByIsbn(bookSearch);
  }
}
