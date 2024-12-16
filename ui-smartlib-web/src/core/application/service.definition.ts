import { BookCompartment } from "@/book/domain/models";
import { Cart } from "../domain/cart.model";
import { CartDto } from "./dto";
import {
  BookLoan,
  BookLoanItem,
  BookLoanItemStatus,
} from "../domain/loan.model";

export interface CartService {
  checkout(dto: CartDto): Promise<Cart>;
  onCheckOutFailed(cart: Cart): Promise<Cart>;
}

export interface BookLendingService {
  checkout(cart: Cart): Promise<Cart>;
}

export interface CoreApiClient {
  checkout(cart: Cart): Promise<Cart>;
}

export interface BridgeIoApiClient {
  openCompartments(comparments: BookCompartment[]): Promise<any>;
}

export interface BookLoanService {
  checkout(cart: Cart): Promise<BookLoan>;
  addLoanItemStatus(status: BookLoanItemStatus): Promise<BookLoanItemStatus>;
}
