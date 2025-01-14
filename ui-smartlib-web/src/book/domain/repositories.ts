import {
  Book,
  BookByFtagsVibes,
  BookCategory,
  BookCompartment,
  BookCopy,
  BookImage,
  BookItems,
  BooksByCategory,
  BooksPagination,
  CategoryGraph,
  FtagItem,
  FtagsEnum,
  IBook,
  IBookDetail,
  Isbn,
  LibraryInventory,
  SubCategoryGraph,
} from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  updateCopies(books: BookCopy[]): Promise<BookCopy[]>;
  getFtagsBy(tagName: FtagsEnum): Promise<FtagItem[]>;
  findByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]>;
  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategoryGraph>;
  // ***********
  // findAllCategories(): Promise<BookCategory[]>;
  findAllByCategory(categoryId: string): Promise<BooksByCategory[]>; // return with images
  findAllBy(query: string): Promise<Book[]>; // just return book id and name,
  findById(isbn: string): Promise<Book>; // return with images
  findAllBooks(params:BooksPagination):Promise<Book[]>
  loanLibraryInventory(): Promise<Book[]>
  findByTranslationId(translationId: string): Promise<IBookDetail[]>;
  findAllBooks(params: BooksPagination): Promise<Book[]>;
  loadLibraryInventory(searchCategoryId?: string): Promise<LibraryInventory>;
}

// 1. seach all available categories.
// 2. having selected one category, load all books belonging to the selected category.
// 3. fetch all books paginated.
// 4. fetch books by {author, titulo, etc.}  / must only query book table.
// 5. fetch book by id: load editions, images
// 6. eliminate book_edition, add edition info to book table.
