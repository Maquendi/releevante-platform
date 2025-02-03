import { SettingsFacade } from "@/core/application/settings.facade";
import {
  BookCategory,
  Book,
  BookCopy,
  FtagItem,
  FtagsEnum,
  BookByFtagsVibes,
  LibraryInventory,
  IBookDetail,
  Paging,
  PartialBook,
  BookRecomendationParams,
  BookRecomendations,
  SubCategory,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";

import { BookCopySearch } from "./dto";
import { BookService } from "./service.definitions";
import { LibrarySettings } from "@/core/domain/settings.model";

export class DefaultBookServiceImpl implements BookService {
  constructor(
    private bookRepository: BookRepository,
    private librarySettingsService: SettingsFacade
  ) {}

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

  async findAllBookCategory(): Promise<BookCategory[]> {
    return await this.bookRepository.getFtagsBy("category");
  }

  async getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]> {
    return await this.bookRepository.getFtagsBy(tagName);
  }

  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]> {
    return this.bookRepository.findByVibeTags(tagsValues);
  }

  async findByTranslationId(translationId: string): Promise<IBookDetail[]> {
    return this.bookRepository.findByTranslationId(translationId);
  }

  loadBooksBySubcategory(subcategoryEnValue: string): Promise<SubCategory> {
    return this.bookRepository.loadBooksBySubcategory(subcategoryEnValue);
  }

  async findAvailableCopiesByIsbnForRent(
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
        return bookCopies
          .sort((a, b) => a.usageCount - b.usageCount)
          .slice(0, qty);
      });

    return (await Promise.all(seachPromises)).flat();
  }

  async findAvailableCopiesByIsbnForPurchase(
    bookSearch: BookCopySearch[]
  ): Promise<BookCopy[]> {
    const librarySetting =
      await this.librarySettingsService.getLibrarySetting();

    const seachPromises = bookSearch
      .filter((item) => item.qty > 0)
      .map(async ({ isbn, qty }) => {
        const bookCopies = await this.bookRepository.findAllBookCopiesAvailable(
          {
            value: isbn,
          }
        );
        return bookCopies
          .filter((item) => this.isValidForSale(item, librarySetting))
          .slice(0, qty);
      });

    return (await Promise.all(seachPromises)).flat();
  }

  isValidForSale(copy: BookCopy, setting: LibrarySettings): boolean {
    return copy.usageCount >= setting.bookUsageCountBeforeEnablingSale;
  }

  loadPartialBooksPaginated(paging: Paging): Promise<PartialBook[]> {
    return this.bookRepository.loadPartialBooksPaginated(paging);
  }

  bookRecomendationsByTags(
    params: BookRecomendationParams
  ): Promise<BookRecomendations> {
    return this.bookRepository.bookRecomendationsByTags(params);
  }

  loadLibraryInventory(): Promise<LibraryInventory> {
    return this.bookRepository.loadLibraryInventory();
  }
}
