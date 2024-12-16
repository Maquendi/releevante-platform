import { BookCopy } from "@/book/domain/models";
import { Cart, CartId } from "./cart.model";
import { BookLoan, BookLoanItem, BookLoanItemStatus } from "./loan.model";
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
  save(loan: BookLoan): Promise<void>;
  addLoanItemStatus(status: BookLoanItemStatus): Promise<BookLoanItemStatus>;
}

export interface SettingsRepository {
  getSetting(): Promise<LibrarySettings>;
}
