export interface BookCategory {
  id: string;
  title: string;
}

export interface BookImage {
  id: string;
  url: string;
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

export interface BookFilter {
  categoryId: string;
  limit?: number;
}

export interface BookEdition {
  isbn: string;
  title: string;
  images: BookImage[];
}

export interface Book {
  isbn: string;
  bookTile: string;
  editionTitle: string;
  images?: BookImage[];
}
