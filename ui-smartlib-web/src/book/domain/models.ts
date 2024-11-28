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
}

export interface BooksByCategory {
  subCategory: {
    id: string;
    esSubCategoryName: string;
    enSubCategoryName: string;
    frSubCategoryName: string;
  };
  category: {
    id: string;
    esCategoryName: string;
    frCategoryName: string;
    enCategoryName: string;
  };

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

export interface Book {
  isbn: string;
  bookTitle: string;
  author: string;
  editionTitle: string;
  images?: BookImage[];
  publisher?: string;
}

export interface CategoryBooks {
  categoryName: string;
  books: Book[];
}
