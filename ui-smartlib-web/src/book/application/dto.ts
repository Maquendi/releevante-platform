import { BookCopy } from "../domain/models";

export interface SearchCriteria {
  filter: Partial<BookCopy>;
  limit?: number;
}

export interface BookCopySearch {
  isbn: string;
  qty: number;
}

export interface BookCopySearchResults {
  isbn: string;
  qty: number;
  bookCopies: BookCopy[];
}
