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

export interface BookImage {
  id: string;
  url: string;
}

export interface CategoryBookItem {
  isbn: string;
  bookTitle: string;
  author: string;
  imageUrl: string;
  votes: number;
  rating: number;
  correlationId: string;
  categories:FtagItem[]
}

export interface CategoryTranslations {
  id?: string;
  esCategoryName: string;
  frCategoryName: string;
  enCategoryName: string;
}

export interface BooksByCategory {
  subCategory: {
    id: string;
    enName: string;
    esName: string;
    frName: string;
  };
  books: CategoryBookItem[];
}

export interface BookCopy {
  id: string;
  is_available: boolean;
  at_position: string;
  book_isbn: string;
}

export interface BookCompartment {
  compartment: string;
}

export interface Isbn {
  value: string;
}

export interface BookItems {
  id: string;
  title: string;
  publisher: string;
  images: BookImage[];
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

export interface Book {
  id: string;
  bookTitle: string;
  author: string;
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
  categories:BookCategory[]
  rating?: number;
  votes?: number;
  price?: number;
}

export interface CategoryBooks {
  categoryName: string;
  books: Book[];
}

export interface IBook {
  isbn: string;
  bookTitle: string;
  author: string;
  correlationId: string;
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
  publicIsbn?: string;
  qty: number;
}

export interface PartialBook {
  isbn: string;
}

export interface SubCategoryGraph {
  id: string;
  en: string;
  fr: string;
  es: string;
  books: PartialBook[];
}

export interface CategoryGraph {
  id: string;
  en: string;
  fr: string;
  es: string;
  subCategories: SubCategoryGraph[];
}

export interface LibraryInventory {
  categories: CategoryGraph[];
  inventory: IBook[];
}
