import { BookCopy } from "@/book/domain/models";
import { Cart, CartId } from "./cart.model";
import { BookLoan } from "./loan.model";

export interface TransactionCallback {
  execute(): Promise<void>;
}

export interface CartRepository {
  save(cart: Cart): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
  find(cartId: CartId): Promise<Cart>
}

export interface LoanRepository {
  save(
    loan: BookLoan,
    bookCopies: BookCopy[],
    transactionCb: TransactionCallback
  ): Promise<void>;
}
