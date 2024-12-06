
export const ftagsEnum= [
  "sub_category",
  "keywords",
  "book_status",
  "reading_vibe",
  "mood_vibe",
  "flavor_story_vibe",
] as const

export type FtagsEnum = typeof ftagsEnum[number]; 

export interface FtagItem {
  id: string;
  tagName: FtagsEnum 
  enTagValue: string;
  frTagValue: string;
  esTagValue: string;
}

export interface BookByFtagsVibes{
  readingvibe:string,
  moodVibe:string
  favorstoryvibe:string
}


export interface BookCategory {
  id: string;
  esName: string;
  frName: string;
  enName: string;
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
  correlationId:string
}

interface CategoryTranslations{
  id?: string;
  esCategoryName: string;
  frCategoryName: string;
  enCategoryName: string;
}

export interface BooksByCategory {
  subCategory: {
    id: string;
    esSubCategoryName: string;
    enSubCategoryName: string;
    frSubCategoryName: string;
  };
  category:CategoryTranslations

  books: CategoryBookItem[];
}

export interface BookCopy {
  id: string;
  is_available: boolean;
  at_position: string;
  isbn: string;
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

export interface BookLanguage{
  bookId:string,
  language:string
}

export interface Book {
  id: string;
  bookTitle: string;
  author: string;
  correlationId:string
  editionTitle: string;
  images?: BookImage[];
  publisher: string;
  enDescription:string;
  esDescription:string;
  frDescription:string;
  publicationDate:string;
  printLength:number
  dimensions:string;
  bookLanguages:BookLanguage[],
  category:CategoryTranslations,
  rating?:number
  votes?:number
  price?:number
}


export interface CategoryBooks {
  categoryName: string;
  books: Book[];
}
