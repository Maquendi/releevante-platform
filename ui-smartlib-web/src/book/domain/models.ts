export interface BookCategory {
  id: string;
   name: string;
}

export interface BookImage {
  id: string;
  url: string;
}

export interface BooksByCategory {
  subCategory: string;
  books: {
    isbn: string;
    bookTitle: string;
    author: string;
    imageUrl: string;
  }[];
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
}

export interface CategoryBooks{
  categoryName:string,
  books:Book[]
}
