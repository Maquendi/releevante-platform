import { LibrarySettings } from "@/core/domain/settings.model";
import {
  Book,
  BookByFtagsVibes,
  BookCategory,
  BookCopy,
  BookRecomendationParams,
  BookRecomendations,
  BooksByCategory,
  BooksPagination,
  FtagItem,
  FtagsEnum,
  IBookDetail,
  LibraryInventory,
  Paging,
  PartialBook,
  SubCategory,
} from "../domain/models";
import { BookCopySearch } from "./dto";

export interface BookService {
  findAllBookCategory(): Promise<BookCategory[]>;
  findAvailableCopiesByIsbnForPurchase(
    search: BookCopySearch[]
  ): Promise<BookCopy[]>;
  findAvailableCopiesByIsbnForRent(
    search: BookCopySearch[]
  ): Promise<BookCopy[]>;
  markUnavailable(books: BookCopy[]): Promise<BookCopy[]>;
  findByTranslationId(
    translationId: string,
    setting: LibrarySettings
  ): Promise<IBookDetail[]>;
  getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]>;
  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]>;
  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategory>;
  loadPartialBooksPaginated(paging?: Paging): Promise<PartialBook[]>;
  bookRecomendationsByTags(
    params: BookRecomendationParams,
    setting: LibrarySettings
  ): Promise<BookRecomendations>;
  loadLibraryInventory(): Promise<LibraryInventory>;
}

export interface BookServiceFacade {
  findAvailableCopiesByIsbnForPurchase(
    search: BookCopySearch[]
  ): Promise<BookCopy[]>;
  findAvailableCopiesByIsbnForRent(
    search: BookCopySearch[]
  ): Promise<BookCopy[]>;
  findAllBookCategory(): Promise<BookCategory[]>;
  getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]>;
  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]>;
  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategory>;
  loadPartialBooksPaginated(paging?: Paging): Promise<PartialBook[]>;
  bookRecomendationsByTags(
    params: BookRecomendationParams,
    setting: LibrarySettings
  ): Promise<BookRecomendations>;
  loadLibraryInventory(): Promise<LibraryInventory>;
}
