import { UserId } from "@/identity/domain/models";

export type LoanStatusValues =
  | "RETURNED_ON_TIME"
  | "RETURNED_BEFORE_TIME"
  | "RETURNED_OVERDUE"
  | "CURRENT"
  | "OVERDUE"
  | "PENDING"
  | "CHECKING_OUT";

export type LoanItemStatusValues =
  | "REPORTED_LOST"
  | "LOST"
  | "RETURNED"
  | "REPORTED_DAMAGE"
  | "DAMAGED"
  | "REPORTED_SOLD"
  | "DOOR_OPENING"
  | "DOOR_OPENED"
  | "CHECKOUT_STARTED"
  | "CHECKOUT_FAILED"
  | "CHECKOUT_SUCCESS";

export interface BookTransactionItemStatus {
  id: string;
  itemId: string;
  status: LoanItemStatusValues;
  createdAt: string;
}

export interface BookTransactions{
  rent?: BookTransaction;
  purchase?: BookTransaction 
}

export interface BookTransactionItem {
  id: string;
  isbn: string;
  cpy: string;
  position: string;
}

export interface BookTransactionStatus {
  id: string;
  transactionId: string;
  status: LoanStatusValues;
  createdAt: string;
}

export interface BookTransaction {
  id: string;
  clientId: UserId;
  transactionType: "RENT" | "PURCHASE";
  items: BookTransactionItem[];
  status: BookTransactionStatus[];
  createdAt: Date;
  returnsAt?: Date;
}

interface BookLoanQuery {
  id: string;
  bookTitle: string;
  author: string;
  loanItemId: string;
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
