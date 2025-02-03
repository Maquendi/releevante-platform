import { UserId } from "@/identity/domain/models";
import { LoanItemStatusValues, LoanStatusValues } from "../domain/loan.model";

export type CartItemDto = {
  isbn: string;
  qty: number;
  transactionType: "RENT" | "PURCHASE";
};

export interface CartDto {
  userId: UserId;
  items: CartItemDto[];
}

export interface LoanItemStatusDto {
  itemId: string;
  status: LoanItemStatusValues;
}

export interface LoanStatusDto {
  loanId: string;
  status: LoanStatusValues;
}
