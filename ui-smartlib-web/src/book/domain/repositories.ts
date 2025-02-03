import {
  Book,
  BookByFtagsVibes,
  BookCompartment,
  BookCopy,
  BookRecomendationParams,
  BookRecomendations,
  FtagItem,
  FtagsEnum,
  IBookDetail,
  Isbn,
  LibraryInventory,
  Paging,
  PartialBook,
  SubCategory,
} from "./models";

export interface BookRepository {
  create(book: Book): Promise<Book>;
  findAllBookCopiesAvailable(isbn: Isbn): Promise<BookCopy[]>;
  findBookCompartments(books: BookCopy[]): Promise<BookCompartment[]>;
  updateCopies(books: BookCopy[]): Promise<BookCopy[]>;
  getFtagsBy(tagName: FtagsEnum): Promise<FtagItem[]>;
  findByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]>;
  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategory>;
  loadLibraryInventory(): Promise<LibraryInventory>;
  findByTranslationId(translationId: string): Promise<IBookDetail[]>;
  loadPartialBooksPaginated(paging?: Paging): Promise<PartialBook[]>;
  bookRecomendationsByTags(
    params: BookRecomendationParams
  ): Promise<BookRecomendations>;
}
