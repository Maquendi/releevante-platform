import { UserId } from "@/identity/domain/models";
import { LoanItemStatusValues, LoanStatusValues } from "../domain/loan.model";
import { CartId } from "../domain/cart.model";

export type CartItemDto = {
  id?: string;
  isbn: string;
  qty: number;
  transactionType: "RENT" | "PURCHASE";
};

export interface CartDto {
  id?: CartId;
  userId: UserId;
  items: CartItemDto[];
}

export interface CartInitDto {
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
