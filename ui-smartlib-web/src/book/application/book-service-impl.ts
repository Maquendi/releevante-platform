import { SettingsFacade } from "@/core/application/settings.facade";
import {
  BookCategory,
  Book,
  BookCopy,
  BooksPagination,
  BooksByCategory,
  FtagItem,
  FtagsEnum,
  BookByFtagsVibes,
  LibraryInventory,
  BookItems,
  BookImage,
  IBookDetail,
  SubCategoryGraph,
  Paging,
  PartialBook,
  BookRecomendationParams,
  BookRecomendations,
} from "../domain/models";
import { BookRepository } from "../domain/repositories";

import { BookCopySearch, BookRatingDto, SearchCriteria } from "./dto";
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

  async findAllBookBySearchCriteria(searchCriteria: string): Promise<Book[]> {
    return await this.bookRepository.findAllBy(searchCriteria);
  }

  async findAllBookCategory(): Promise<BookCategory[]> {
    return await this.bookRepository.getFtagsBy("category");
  }

  async findBookById(isbn: string): Promise<Book> {
    return await this.bookRepository.findById(isbn);
  }

  async findAllBooks(params: BooksPagination): Promise<Book[]> {
    return await this.bookRepository.findAllBooks(params);
  }

  async getFtagsByType(tagName: FtagsEnum): Promise<FtagItem[]> {
    return await this.bookRepository.getFtagsBy(tagName);
  }

  findBooksByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book[]> {
    return this.bookRepository.findByVibeTags(tagsValues);
  }

  async findAllBookByCategory(): Promise<BooksByCategory[]> {
    const results = await this.bookRepository.loanLibraryInventory();

    const groupedBooks: { [key: string]: any } = {};

    results.forEach(({ categories, subCategories, ...book }) => {
      subCategories?.forEach((subCat) => {
        const subCategoryId = subCat.id || "";
        if (!groupedBooks[subCategoryId]) {
          groupedBooks[subCategoryId] = {
            subCategory: subCat,
            books: [],
            bookIds: new Set(),
          };
        }

        if (!groupedBooks[subCategoryId].bookIds.has(book.id)) {
          groupedBooks[subCategoryId].books.push({
            ...book,
            categories,
          });
          groupedBooks[subCategoryId].bookIds.add(book.id);
        }
      });
    });

    const data = Object.values(groupedBooks).map(
      ({ bookIds, ...rest }) => rest
    );

    return data as BooksByCategory[];
  }

  async loanLibraryInventory(): Promise<Book[]> {
    return await this.bookRepository.loanLibraryInventory();
  }

  async loadLibraryInventory(
    searchCategoryId?: string
  ): Promise<LibraryInventory> {
    return await this.bookRepository.loadLibraryInventory(searchCategoryId);
  }

  async findByTranslationId(translationId: string): Promise<IBookDetail[]> {
    return this.bookRepository.findByTranslationId(translationId);
  }

  loadBooksBySubcategory(
    subcategoryEnValue: string
  ): Promise<SubCategoryGraph> {
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
}
