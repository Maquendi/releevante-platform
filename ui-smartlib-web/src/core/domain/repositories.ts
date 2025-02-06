import { UserId } from "@/identity/domain/models";
import { Cart, CartId } from "./cart.model";
import {
  BookTransaction,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus
} from "./loan.model";
import { Rating } from "./service-rating.model";
import { LibrarySettings } from "./settings.model";

export interface TransactionCallback {
  execute(): Promise<void>;
}

export interface CartRepository {
  save(cart: Cart): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
  findById(cartId: CartId): Promise<Cart>;
  findByUser(userId: UserId): Promise<Cart>;
}

export interface LoanRepository {
  save(transactions: BookTransactions): Promise<void>;
  addLoanItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus>;
  addLoanStatus(status: BookTransactionStatus): Promise<BookTransactionStatus>;
  getUserLoans(clientId: UserId): Promise<BookTransaction[]>;
}

export interface SettingsRepository {
  getSetting(): Promise<LibrarySettings>;
}

export interface ServiceRepository {
  saveServiceReview(bookReview: Rating): Promise<Rating[]>;
}
