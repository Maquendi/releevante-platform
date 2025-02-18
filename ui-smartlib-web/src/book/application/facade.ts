import { SettingsFacade } from "@/core/application/settings.facade";
import {
  Book,
  BookByFtagsVibes,
  BookCategory,
  BookCopy,
  BookRecomendationParams,
  BookRecomendations,
  FtagItem,
  FtagsEnum,
  IBookDetail,
  LibraryInventory,
  Paging,
  PartialBook,
  SubCategory,
} from "../domain/models";
import { BookCopySearch } from "./dto";
import { BookService, BookServiceFacade } from "./service.definitions";

export class BookServiceFacadeImpl implements BookServiceFacade {
  constructor(
    private bookService: BookService,
    private librarySettingFacade: SettingsFacade
  ) {}

  async findAllBookCategory(): Promise<BookCategory[]> {
    return await this.bookService.findAllBookCategory();
  }

  async findByTranslationId(translationId: string): Promise<IBookDetail[]> {
    console.log("loading book details: " + translationId);

    const setting = await this.librarySettingFacade.getLibrarySetting();

    return await this.bookService.findByTranslationId(translationId, setting);
  }

  async getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]> {
    return await this.bookService.getFtagsByType(tagName);
  }

  async findAvailableCopiesByIsbnForPurchase(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    return this.bookService.findAvailableCopiesByIsbnForPurchase(bookSearch);
  }

  async findAvailableCopiesByIsbnForRent(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    return this.bookService.findAvailableCopiesByIsbnForRent(bookSearch);
  }

  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]> {
    return this.bookService.findBooksByVibeTags(tagsValues);
  }

  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategory> {
    return this.bookService.loadBooksBySubcategory(subcategoryEnValue);
  }

  loadLibraryInventory(): Promise<LibraryInventory> {
    return this.bookService.loadLibraryInventory();
  }

  loadPartialBooksPaginated(paging?: Paging): Promise<PartialBook[]> {
    return this.bookService.loadPartialBooksPaginated(paging);
  }

  async bookRecomendationsByTags(
    params: BookRecomendationParams
  ): Promise<BookRecomendations> {
    const setting = await this.librarySettingFacade.getLibrarySetting();

    return this.bookService.bookRecomendationsByTags(params, setting);
  }
}
