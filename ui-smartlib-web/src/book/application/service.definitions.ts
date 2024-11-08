import { BookCopySchema } from "@/config/drizzle/schemas";
import { Book, BookCategory, BookCopy, BooksPagination, CategoryBooks } from "../domain/models";
import { BookCopySearch, SearchCriteria } from "./dto";

export interface BookService {
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(categoryId: string): Promise<CategoryBooks>;
  findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]>;
  findAvailableCopiesByIsbn(search: BookCopySearch[]): Promise<BookCopy[]>;
  markUnavailable(books: BookCopy[]): Promise<BookCopy[]>;
  findCopiesBy(filter:SearchCriteria):Promise<BookCopySchema[]>
  findBookById(isbn:string):Promise<Book>
  findAllBooks(params:BooksPagination):Promise<Book[]>
  
}


export interface BookServiceFacade {
  findAvailableCopiesByIsbn(search: BookCopySearch[]): Promise<BookCopy[]>;
  findAllBookCategory(): Promise<BookCategory[]>;
  findAllBookByCategory(categoryId: string): Promise<CategoryBooks>;
  findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]>;
  findAllBooks(params:BooksPagination):Promise<Book[]>
  findBookById(isbn:string):Promise<Book>


}