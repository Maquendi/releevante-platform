import { UserId } from "@/identity/domain/models";

export enum LoanStatusValues {
  "RETURNED_ON_TIME",
  "RETURNED_BEFORE_TIME",
  "RETURNED_OVERDUE",
  "CURRENT",
  "OVERDUE",
  "PENDING",
  "CHECKING_OUT",
}
export type LoanItemStatusValues = 
  | "REPORTED_LOST"
  | "LOST"
  | "RETURNED"
  | "REPORTED_DAMAGE"
  | "DAMAGED"
  | "REPORTED_SOLD"
  | "SOLD"
  | "BORROWED";


export interface BookLoanItemStatus {
  id: string;
  itemId: string;
  status: LoanItemStatusValues;
  createdAt: string
}


export interface BookLoanItem {
  id: string;
  isbn: string;
  cpy: string;
  position: string;
}

export interface BookLoanStatus {
  id: string;
  loanId: string;
  status: LoanStatusValues;
  createdAt: Date;
}

export interface BookLoan {
  id: string;
  clientId: UserId;
  loanItems: BookLoanItem[];
  createdAt: Date;
  returnsAt: Date;
  status: BookLoanStatus[];
}


interface BookLoanQuery {
  id: string; 
  bookTitle: string; 
  author: string; 
  loanItemId:string
  image: string; 
  categories: {
    enCategory: string; 
    frCategory: string; 
    esCategory: string; 
    isbn: string; 
  }[];
}

export interface LoanGroup {
  returnDate: string; 
  books: BookLoanQuery[];
}