import { BookServiceFacade } from "@/book/application/service.definitions";
import { Cart } from "../domain/cart.model";
import {
  BookTransaction,
  BookTransactionItem,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
  LoanGroup,
} from "../domain/loan.model";
import { BookLoanService } from "./service.definition";
import { v4 as uuidv4 } from "uuid";
import { LoanRepository } from "../domain/repositories";
import { UserId } from "@/identity/domain/models";

export class BookLoanServiceImpl implements BookLoanService {
  constructor(
    private bookLoanRepository: LoanRepository,
    private bookService: BookServiceFacade
  ) {}

  addLoanStatus(status: BookTransactionStatus): Promise<BookTransactionStatus> {
    return this.bookLoanRepository.addLoanStatus(status);
  }

  addLoanItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus> {
    return this.bookLoanRepository.addLoanItemStatus(status);
  }

  async checkout(cart: Cart): Promise<BookTransactions> {
    const bookCopySearch = cart.cartItems.map(
      ({ isbn, qty, transactionType }) => ({
        isbn,
        qty,
        transactionType,
      })
    );

    const loanItems: BookTransactionItem[] = (
      await this.bookService.findAvailableCopiesByIsbnForRent(
        bookCopySearch.filter((item) => item.transactionType == "RENT")
      )
    ).map(({ book_isbn, id, at_position }) => ({
      id: uuidv4(),
      isbn: book_isbn,
      cpy: id,
      position: at_position,
    }));

    const purchasedItems = (
      await this.bookService.findAvailableCopiesByIsbnForPurchase(
        bookCopySearch.filter((item) => item.transactionType == "PURCHASE")
      )
    ).map(({ book_isbn, id, at_position }) => ({
      id: uuidv4(),
      isbn: book_isbn,
      cpy: id,
      position: at_position,
    }));

    const transactions: BookTransactions = {};

    const today = new Date();

    if (loanItems.length) {
      const returnsAt = today;
      returnsAt.setDate(returnsAt.getDate() + 5);
      const loanId = uuidv4();
      const loanStatus: BookTransactionStatus = {
        id: uuidv4(),
        transactionId: loanId,
        status: "CHECKING_OUT",
        createdAt: today.toISOString(),
      };

      const bookLoan: BookTransaction = {
        id: loanId,
        clientId: cart.userId,
        items: loanItems,
        createdAt: today,
        transactionType: "RENT",
        returnsAt: returnsAt,
        status: [loanStatus],
      };

      transactions["rent"] = bookLoan;
    }

    if (purchasedItems.length) {
      const returnsAt = today;
      returnsAt.setDate(returnsAt.getDate() + 5);
      const purchaseId = uuidv4();
      const purchaseStatus: BookTransactionStatus = {
        id: uuidv4(),
        transactionId: purchaseId,
        status: "CHECKING_OUT",
        createdAt: today.toISOString(),
      };

      const bookPurchase: BookTransaction = {
        id: purchaseId,
        clientId: cart.userId,
        items: purchasedItems,
        createdAt: today,
        transactionType: "PURCHASE",
        returnsAt: returnsAt,
        status: [purchaseStatus],
      };

      transactions["purchase"] = bookPurchase;
    }

    const itemsCount = Object.keys(transactions)
      .map((key) => transactions[key].items.length)
      .reduce((a, b) => a + b, 0);

    if (itemsCount !== cart.cartItems.length) {
      throw new Error("failed to find all items selected");
    }

    await this.bookLoanRepository.save(transactions);

    return transactions;
  }

  getUserLoanBooks(clientId: UserId): Promise<LoanGroup[]> {
    return this.bookLoanRepository.getUserLoanBooks(clientId);
  }
}
