import { BookCategory, Book, BookCopy } from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { defaultBookRepository } from "../infrastructure/repositories-impl";

import { BookCopySearch, SearchCriteria } from "./dto";
import { BookService } from "./services";

class DefailtBookServiceImpl implements BookService {
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

  findAllBookCategory(): Promise<BookCategory[]> {
    throw new Error("Method not implemented.");
  }

  findAllBookByCategory(category: BookCategory): Promise<Book[]> {
    throw new Error("Method not implemented.");
  }

  findAllBookBySearchCriteria(searchCriteria: SearchCriteria): Promise<Book[]> {
    throw new Error("Method not implemented.");
  }
}

export const defaultBookService = new DefailtBookServiceImpl(
  defaultBookRepository
);
