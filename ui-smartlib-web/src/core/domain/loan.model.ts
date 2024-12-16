import { UserId } from "@/identity/domain/models";

export enum LoanStatuses {
  "RETURNED_ON_TIME",
  "RETURNED_BEFORE_TIME",
  "RETURNED_OVERDUE",
  "CURRENT",
  "OVERDUE",
  "PENDING",
  "CHECKING_OUT",
}

export enum LoanItemStatusValues {
  REPORTED_LOST,
  LOST,
  RETURNED,
  REPORTED_DAMAGE,
  DAMAGED,
  REPORTED_SOLD,
  SOLD,
  BORROWED,
}

export interface BookLoanItemStatus {
  id: string;
  itemId: string;
  status: LoanItemStatusValues;
  createdAt: Date
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
  status: LoanStatuses;
  isSynced: boolean;
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
