import { BookCopySchema } from "@/config/drizzle/schemas";
import { BookCategory, Book, BookItems, BookCopy, BookFilter } from "../domain/models";
import { BookRepository } from "../domain/repositories";
import { defaultBookRepository } from "../infrastructure/repositories-impl";
import { BookService } from "./services";

class DefailtBookServiceImpl implements BookService {
  constructor(private bookRepository: BookRepository) {}
    findBookAvailableCopies(book: { book_id: string; edition_id:string },limit?:number): Promise<BookCopySchema[]> {
       return this.bookRepository.findCopiesBy({filter:{book_id:book.book_id,edition_id:book.edition_id,is_available:true},limit})
    }

  findAllBookCategory(): Promise<BookCategory[]> {
    throw new Error("Method not implemented.");
  }

  findAllBookByCategory(category: BookCategory): Promise<Book[]> {
    throw new Error("Method not implemented.");
  }

  async findAllBookCopiesAvailableByEdition(
    bookEdition: BookItems
  ): Promise<BookCopy[]> {
    return this.bookRepository.findAllBookCopiesAvailable(bookEdition);
  }

  findAllBookCopiesAvailableLocallyByEdition(
    bookEdition: BookItems
  ): Promise<BookCopy[]> {
    throw new Error("Method not implemented.");
  }

  findAllBookBySearchCriteria(searchCriteria: BookFilter): Promise<Book> {
    return this.bookRepository.findBy(searchCriteria)
  }
}


export const defaultBookService = new DefailtBookServiceImpl(defaultBookRepository)
