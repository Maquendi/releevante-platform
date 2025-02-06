import { UserId } from "@/identity/domain/models";

export type LoanStatusValues =
  | "RETURNED"
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
  | "CHECKOUT_PENDING"
  | "CHECKIN_STARTED"
  | "CHECKIN_PENDING"
  | "CHECKIN_SUCCESS"
  | "CHECKOUT_FAILED"
  | "CHECKOUT_SUCCESS";

export interface BookTransactionItemStatus {
  id: string;
  itemId: string;
  status: LoanItemStatusValues;
  createdAt: string;
}

export interface BookTransactions {
  rent?: BookTransaction;
  purchase?: BookTransaction;
}

export interface BookTransactionItem {
  id: string;
  isbn: string;
  cpy: string;
  position: string;
  image?: string;
  title?: string;
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
  createdAt: string;
  returnsAt?: string;
}
