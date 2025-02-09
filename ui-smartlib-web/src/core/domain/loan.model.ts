import { UserId } from "@/identity/domain/models";

export enum TransactionStatusEnum {
  RETURNED = "RETURNED",
  CURRENT = "CURRENT",
  OVERDUE = "OVERDUE",
  PENDING = "PENDING",
}

export enum TransactionItemStatusEnum {
  LOST = "LOST",
  DAMAGED = "DAMAGED",
  SOLD = "SOLD",
  DOOR_OPENING = "DOOR_OPENING",
  DOOR_OPENED = "DOOR_OPENED",
  CHECKIN_STARTED = "CHECK_IN_STARTED",
  CHECKIN_PENDING = "CHECK_IN_PENDING",
  CHECKIN_SUCCESS = "CHECK_IN_SUCCESS",
  CHECKOUT_STARTED = "CHECK_OUT_STARTED",
  CHECKOUT_PENDING = "CHECK_OUT_PENDING",
  CHECKOUT_FAILED = "CHECK_OUT_FAILED",
  CHECKOUT_SUCCESS = "CHECK_OUT_SUCCESS",
}

export interface BookTransactionItemStatus {
  id: string;
  itemId: string;
  status: TransactionItemStatusEnum;
  createdAt: string;
  transactionType: TransactionType;
  cpy: string;
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
  status: TransactionStatusEnum;
  createdAt: string;
}

export enum TransactionType {
  RENT = "RENT",
  PURCHASE = "PURCHASE",
}

export interface BookTransaction {
  id: string;
  clientId: UserId;
  transactionType: TransactionType;
  items: BookTransactionItem[];
  status: BookTransactionStatus[];
  createdAt: string;
  returnsAt?: string;
}
