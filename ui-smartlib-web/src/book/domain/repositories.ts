
import { Book, BookCategory, BookCompartment, BookCopy, BookFilter, Isbn } from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  findBy(filter: BookFilter): Promise<Book>;
  findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  updateCopies(books: BookCopy[]): Promise<BookCopy[]>;

  // ***********
  findAllCategories(category: string): Promise<BookCategory>;
  findAllByCategory(): Promise<Book[]>; // return with images
  findAllByCategory(): Promise<Book[]>; // return with images
  findAllBy(anything: string): Promise<Book[]>; // just return book id and name,
  findById(id: string): Promise<Book>; // return with images
}




// 1. seach all available categories.
// 2. having selected one category, load all books belonging to the selected category.
// 3. fetch all books paginated.
// 4. fetch books by {author, titulo, etc.}  / must only query book table.
// 5. fetch book by id: load editions, images  
// 6. eliminate book_edition, add edition info to book table.