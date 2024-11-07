import { BookCopy } from "../domain/models";
import { BookCopySearch } from "./dto";
import { BookService, BookServiceFacade } from "./service.definitions";

export class BookServiceFacadeImpl implements BookServiceFacade{
  constructor(private bookService: BookService) {}

  async findAvailableCopiesByIsbn(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    return this.bookService.findAvailableCopiesByIsbn(bookSearch);
  }
}
