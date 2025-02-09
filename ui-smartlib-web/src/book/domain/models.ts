import {
  TransactionItemStatusEnum,
  TransactionType,
} from "@/core/domain/loan.model";

export const ftagsEnum = [
  "category",
  "subcategory",
  "keyword",
  "book_status",
  "reading_vibe",
  "mood_vibe",
  "flavor_story_vibe",
] as const;

export type FtagsEnum = (typeof ftagsEnum)[number];

export interface FtagItem {
  id: string;
  tagName: FtagsEnum;
  enTagValue: string;
  frTagValue: string;
  esTagValue: string;
}

export interface BookImage {
  id: string;
  image: string;
}

export interface BookByFtagsVibes {
  readingvibe: string;
  moodVibe: string;
  favorstoryvibe: string;
}

export interface BookCategory {
  id: string;
  tagName: FtagsEnum;
  enTagValue: string;
  frTagValue: string;
  esTagValue: string;
}

export interface CategoryTranslations {
  id?: string;
  esCategoryName: string;
  frCategoryName: string;
  enCategoryName: string;
}

export interface BookItems {
  categories: FtagItem[];
  subCategories: FtagItem[];
  tags: FtagItem[];
  id: string;
  bookTitle: string;
  publisher: string;
  image: string;
  votes: string;
  rating: string;
  correlationId: string;
}

export interface BooksByCategory {
  subCategory: {
    id: string;
    enName: string;
    esName: string;
    frName: string;
  };
  books: BookItems[];
}

export enum BookCopyStatusEnum {
  SOLD = "SOLD",
  LOST = "LOST",
  BORROWED = "BORROWED",
  DAMAGED = "DAMAGED",
  AVAILABLE = "AVAILABLE",
}

export const BookCopyStatusMap = {
  [TransactionItemStatusEnum.CHECKIN_SUCCESS]: BookCopyStatusEnum.AVAILABLE,
  [`${TransactionItemStatusEnum.CHECKOUT_SUCCESS}:${TransactionType.RENT}`]:
    BookCopyStatusEnum.BORROWED,
  [`${TransactionItemStatusEnum.CHECKOUT_SUCCESS}:${TransactionType.PURCHASE}`]:
    BookCopyStatusEnum.SOLD,
  [TransactionItemStatusEnum.DAMAGED]: BookCopyStatusEnum.DAMAGED,
  [TransactionItemStatusEnum.LOST]: BookCopyStatusEnum.LOST,
  [TransactionItemStatusEnum.SOLD]: BookCopyStatusEnum.SOLD,
};

export const bookCopyStatusMapper = (transaction: {
  type: TransactionType;
  itemStatus: TransactionItemStatusEnum;
}): string => {
  if (transaction.itemStatus === TransactionItemStatusEnum.CHECKOUT_SUCCESS) {
    return BookCopyStatusMap[`${transaction.itemStatus}:${transaction.type}`];
  }

  return BookCopyStatusMap[transaction.itemStatus];
};

export interface BookCopy {
  id: string;
  status: BookCopyStatusEnum;
  at_position: string;
  book_isbn: string;
  usageCount: number;
}

export interface BookCompartment {
  compartment: string;
}

export interface Isbn {
  value: string;
}

export interface BooksPagination {
  limit?: number;
  page?: number;
}

export interface BookEdition {
  isbn: string;
  title: string;
  images: BookImage[];
}

export interface BookLanguage {
  bookId: string;
  language: string;
}

interface BookCopies {
  spanish: number;
  french: number;
  english: number;
}

export interface BookRecomendationParams {
  usersFavFlavorOfStory: string;
  usersCurrentMood: string;
  usersReadingPurpose: string;
}

export interface BookRecomendations {
  recommended: IBookDetail;
  translations: IBookDetail[];
  others: PartialBook[];
}

export interface Book {
  id: string;
  bookTitle: string;
  copies: BookCopies;
  author: string;
  language?: {
    bookId: string;
    name: string;
  };
  correlationId: string;
  editionTitle: string;
  image: string;
  publisher: string;
  enDescription: string;
  esDescription: string;
  frDescription: string;
  publicationDate: string;
  printLength: number;
  dimensions: string;
  languages: BookLanguage[];
  categories: FtagItem[];
  subCategories: FtagItem[];
  tags: FtagItem[];
  rating?: number;
  votes?: number;
  price?: number;
}

export interface CategoryBooks {
  categoryName: string;
  books: Book[];
}

export interface IBookDetail {
  isbn: string;
  bookTitle: string;
  author: string;
  correlationId: string;
  translationId: string;
  editionTitle: string;
  publisher: string;
  en: string;
  es: string;
  fr: string;
  publicationDate: string;
  printLength: number;
  dimensions: string;
  language: string;
  rating: number;
  votes: number;
  price: number;
  bindingType: string;
  image: string;
  imageId: string;
  publicIsbn?: string;
  qty: number;
  qtyForSale: number;
  categories: { en: string; fr: string; es: string; id: string }[];
}

export interface PartialBook {
  isbn: string;
  title: string;
  author: string;
  translationId: string;
  image: string;
  imageId: string;
  rating: number;
  votes: number;
}

export interface Paging {
  page: number;
  size: number;
}

export interface SubCategory {
  id: string;
  en: string;
  fr: string;
  es: string;
  books: PartialBook[];
}

export interface Category {
  id: string;
  en: string;
  fr: string;
  es: string;
  subCategories: SubCategory[];
}

export interface CategoryV2 {
  id: string;
  en: string;
  fr: string;
  es: string;
  subCategoryRelations: [
    {
      id: string;
      bookRelations: string[];
    }
  ];
}

export interface LibraryInventory {
  categories: CategoryV2[];

  subCategoryMap: {
    [subCategoryId: string]: {
      id: string;
      en: string;
      fr: string;
      es: string;
    };
  };

  books: {
    [isbn: string]: PartialBook;
  };
}
