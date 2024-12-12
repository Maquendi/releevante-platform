import {
  BookCategory,
  Book,
  BookCopy,
  BooksPagination,
  BooksByCategory,
  FtagItem,
  FtagsEnum,
  BookByFtagsVibes,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";

import { BookCopySearch, SearchCriteria } from "./dto";
import { BookService } from "./service.definitions";

export class DefaultBookServiceImpl implements BookService {
  constructor(private bookRepository: BookRepository) {}

  async markUnavailable(bookCopies: BookCopy[]): Promise<BookCopy[]> {
    return this.bookRepository.updateCopies(
      bookCopies.map((book) => ({ ...book, is_available: false }))
    );
  }

  async findAvailableCopiesByIsbn(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    const seachPromises = bookSearch
      .filter((item) => item.qty > 0)
      .map(async ({ isbn, qty }) => {
        const bookCopies = await this.bookRepository.findAllBookCopiesAvailable(
          {
            value: isbn,
          }
        );
        return bookCopies.slice(0, qty);
      });

    return (await Promise.all(seachPromises)).flat();
  }

  async findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]> {
    return await this.bookRepository.findAllBy(searchCriteria);
  }

  async findAllBookByCategory(categoryId: string): Promise<BooksByCategory[]> {
    const result = this.bookRepository.loanLibraryInventory();
    return await this.bookRepository.findAllByCategory(categoryId);
  }

  async findAllBookCategory(): Promise<BookCategory[]> {
    return await this.bookRepository.findAllCategories();
  }

  async findBookById(isbn: string): Promise<Book> {
    return await this.bookRepository.findById(isbn);
  }

  async findAllBooks(params: BooksPagination): Promise<Book[]> {
    return await this.bookRepository.findAllBooks(params);
  }

  async getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]> {
    return await this.bookRepository.getFtagsBy(tagName);
  }

  findBookByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book> {
    return this.bookRepository.findByVibeTags(tagsValues);
  }
}
