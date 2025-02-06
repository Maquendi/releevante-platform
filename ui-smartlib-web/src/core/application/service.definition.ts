import { BookCompartment } from "@/book/domain/models";
import { Cart } from "../domain/cart.model";
import { CartDto, CartInitDto, CartItemDto } from "./dto";
import {
  BookTransaction,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
} from "../domain/loan.model";
import { Rating } from "../domain/service-rating.model";
import { UserId } from "@/identity/domain/models";

export interface CartService {
  checkout(dto: CartDto): Promise<Cart>;
  onCheckOutFailed(dto: CartDto): Promise<Cart>;
  update(dto: CartDto): Promise<Cart>;
  initCart(dto: CartInitDto): Promise<CartDto>
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

export interface BookTransactionService {
  checkout(cart: Cart): Promise<BookTransactions>;
  addLoanItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus>;
  addLoanStatus(status: BookTransactionStatus): Promise<BookTransactionStatus>;
  getUserLoans(clientId: UserId): Promise<BookTransaction[]>;
}


export interface BookTransactionServiceFacade {
  checkout(cart: CartDto): Promise<BookTransactions>;
  addLoanItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus>;
  addLoanStatus(status: BookTransactionStatus): Promise<BookTransactionStatus>;
  getUserLoans(clientId: UserId): Promise<BookTransaction[]>;
}

export interface ServiceRatingService {
  saveServiceReview(bookReview: Rating): Promise<Rating[]>;
}
