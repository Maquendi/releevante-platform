import { UserId } from "@/identity/domain/models";
import { Cart, CartId } from "./cart.model";
import { BookTransactionItemStatus, BookTransactions, BookTransactionStatus, LoanGroup } from "./loan.model";
import { Rating } from "./service-rating.model";
import { LibrarySettings } from "./settings.model";

export interface TransactionCallback {
  execute(): Promise<void>;
}

export interface CartRepository {
  save(cart: Cart): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
  find(cartId: CartId): Promise<Cart>;
}

export interface LoanRepository {
  save(transactions: BookTransactions): Promise<void>;
  addLoanItemStatus(status: BookTransactionItemStatus): Promise<BookTransactionItemStatus>;
  addLoanStatus(status: BookTransactionStatus): Promise<BookTransactionStatus>
 getUserLoanBooks(clientId: UserId): Promise<LoanGroup[]>}

export interface SettingsRepository {
  getSetting(): Promise<LibrarySettings>;
}

export interface ServiceRepository {
  saveServiceReview(bookReview:Rating):Promise<Rating[]>
}

