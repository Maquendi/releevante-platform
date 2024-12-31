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
} from "../domain/models";
import { BookRepository } from "../domain/repositories";

import { BookCopySearch, BookRatingDto, SearchCriteria } from "./dto";
import { BookService } from "./service.definitions";

export class DefaultBookServiceImpl implements BookService {
  constructor(private bookRepository: BookRepository) {}

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
    return await this.bookRepository.getFtagsBy('category');
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

  findBookByVibeTags(tagsValues: BookByFtagsVibes): Promise<Book> {
    return this.bookRepository.findByVibeTags(tagsValues);
  }

  async findAllBookByCategory(): Promise<BooksByCategory[]> {
    const results = await this.bookRepository.loanLibraryInventory()

     const groupedBooks: { [key: string]: any } = {};
    
        results.forEach(({ categories,subCategories, ...book }) => {
      
          subCategories.forEach((subCat) => {
            const subCategoryId = subCat.id || "";
            if (!groupedBooks[subCategoryId]) {
              groupedBooks[subCategoryId] = {
                subCategory: subCat,
                books: [],
                bookIds: new Set(),
              };
            }
    
            if (!groupedBooks[subCategoryId].bookIds.has(book.isbn)) {
              groupedBooks[subCategoryId].books.push({
                ...book,
                categories,
              });
              groupedBooks[subCategoryId].bookIds.add(book.isbn);
            }
          });
        });
    
        const data = Object.values(groupedBooks).map(
          ({ bookIds, ...rest }) => rest
        );
    
        return data as BooksByCategory[];
  }

  async loanLibraryInventory(): Promise<BookItems[]> {
    return await this.bookRepository.loanLibraryInventory()
  }

  getUnsyncBooksLocal(): Promise<BookImage[]> {
    return this.bookRepository.getUnsyncBooksLocal()
  }

  syncBookImages(bookId: string): Promise<void> {
    return this.bookRepository.syncBookImages(bookId)
  }

}
