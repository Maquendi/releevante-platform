
import { Book, BookCategory, BookCompartment, BookCopy,  BooksByCategory,  BooksPagination,  CategoryBooks, Isbn } from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  updateCopies(books: BookCopy[]): Promise<BookCopy[]>;

  // ***********
  findAllCategories(): Promise<BookCategory[]>;
  findAllByCategory(categoryId:string): Promise<BooksByCategory[]>; // return with images
  findAllBy(query: string): Promise<Book[]>; // just return book id and name,
  findById(isbn: string): Promise<Book>; // return with images
  findAllBooks(params:BooksPagination):Promise<Book[]>
}




// 1. seach all available categories.
// 2. having selected one category, load all books belonging to the selected category.
// 3. fetch all books paginated.
// 4. fetch books by {author, titulo, etc.}  / must only query book table.
// 5. fetch book by id: load editions, images  
// 6. eliminate book_edition, add edition info to book table.