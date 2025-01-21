import { BookCompartment } from "@/book/domain/models";
import { Cart } from "../domain/cart.model";
import { CartDto } from "./dto";
import {
  BookTransaction,
  BookTransactionItem,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
  LoanGroup,
} from "../domain/loan.model";
import { Rating } from "../domain/service-rating.model";
import { UserId } from "@/identity/domain/models";

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
  checkout(cart: Cart): Promise<BookTransactions>;
  addLoanItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus>;
  addLoanStatus(status: BookTransactionStatus): Promise<BookTransactionStatus>;
  getUserLoanBooks(clientId: UserId): Promise<LoanGroup[]>;
}

export interface ServiceRatingService {
  saveServiceReview(bookReview: Rating): Promise<Rating[]>;
}
