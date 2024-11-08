import { BookCopySchema } from "@/config/drizzle/schemas";
import { BookCategory, Book, BookCopy, BooksPagination, CategoryBooks } from "../domain/models";
import { BookRepository } from "../domain/repositories";

import { BookCopySearch, SearchCriteria } from "./dto";
import { BookService } from "./service.definitions";

 export class DefaultBookServiceImpl implements BookService {
  constructor(private bookRepository: BookRepository) {}
  findCopiesBy(filter: SearchCriteria): Promise<BookCopySchema[]> {
    throw new Error("Method not implemented.");
  }

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
    return await this.bookRepository.findAllBy(searchCriteria)
  }

  async findAllBookByCategory(categoryId:string):Promise<CategoryBooks>{
    return await this.bookRepository.findAllByCategory(categoryId)
  }

  async findAllBookCategory():Promise<BookCategory[]>{
    return await this.bookRepository.findAllCategories()
  }


  async findBookById(isbn:string):Promise<Book>{
    return await this.bookRepository.findById(isbn)
  }

  async findAllBooks(params:BooksPagination):Promise<Book[]>{
    return await this.bookRepository.findAllBooks(params)
  }
}