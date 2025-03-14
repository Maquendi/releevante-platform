import { UserId } from "@/identity/domain/models";
import {
  TransactionItemStatusEnum,
  TransactionStatusEnum,
  TransactionType,
} from "../domain/loan.model";
import { CartId } from "../domain/cart.model";

export type CartItemDto = {
  id?: string;
  isbn: string;
  qty: number;
  transactionType: TransactionType;
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
  status: TransactionItemStatusEnum;
}

export interface LoanStatusDto {
  loanId: string;
  status: TransactionStatusEnum;
}
