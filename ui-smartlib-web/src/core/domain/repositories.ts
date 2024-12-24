import { Cart, CartId } from "./cart.model";
import { BookLoan, BookLoanItemStatus, BookLoanStatus } from "./loan.model";
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
  addLoanStatus(status: BookLoanStatus): Promise<BookLoanStatus>
}

export interface SettingsRepository {
  getSetting(): Promise<LibrarySettings>;
}
