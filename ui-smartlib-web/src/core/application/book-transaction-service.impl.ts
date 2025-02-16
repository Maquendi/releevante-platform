import { BookServiceFacade } from "@/book/application/service.definitions";
import { Cart } from "../domain/cart.model";
import {
  BookTransaction,
  BookTransactionItem,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
  TransactionStatusEnum,
  TransactionType,
} from "../domain/loan.model";
import { BookTransactionService } from "./service.definition";
import { v4 as uuidv4 } from "uuid";
import { BookTransactionRepository } from "../domain/repositories";
import { UserId } from "@/identity/domain/models";
import { SettingsFacade } from "./settings.facade";
import { MaxBookItemThresholdExceeded } from "@/errors/custom-errors";

export class DefaultBookTransactionService implements BookTransactionService {
  constructor(
    private bookTransactionRepository: BookTransactionRepository,
    private bookService: BookServiceFacade,
    private librarySettingsService: SettingsFacade
  ) {}

  newTransactionStatus(
    status: BookTransactionStatus
  ): Promise<BookTransactionStatus> {
    return this.bookTransactionRepository.newTransactionStatus(status);
  }

  newTransactionItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus> {
    return this.bookTransactionRepository.newTransactionItemStatus(status);
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
        bookCopySearch.filter(
          (item) => item.transactionType == TransactionType.RENT
        )
      )
    ).map(
      ({ book_isbn, id, at_position, image, title, status, usageCount }) => ({
        id: uuidv4(),
        isbn: book_isbn,
        cpy: id,
        position: at_position,
        image,
        title,
        status,
        usageCount,
      })
    );

    const transactions: BookTransactions = {};

    const currentDate = new Date().toISOString();

    if (loanItems.length) {
      // check if user has a pending loan
      // if so check is current loan items + this loan items <= 4;

      const userTransactions = await this.getUserTransactions(cart.userId);

      if (userTransactions?.rent?.length) {
        const allItems = userTransactions.rent.flatMap((loan) => loan.items);

        if (allItems.length) {
          const librarySetting =
            await this.librarySettingsService.getLibrarySetting();

          const isMaxBookThresholdExceeded =
            allItems.length + loanItems.length > librarySetting.maxBooksPerLoan;

          if (isMaxBookThresholdExceeded) {
            throw new MaxBookItemThresholdExceeded(userTransactions.rent);
          }
        }
      }

      const loanId = uuidv4();
      const bookLoan: BookTransaction = {
        id: loanId,
        clientId: cart.userId,
        items: loanItems,
        createdAt: currentDate,
        transactionType: TransactionType.RENT,
        returnsAt: currentDate,
        status: [],
      };

      transactions["rent"] = [bookLoan];
    }

    const purchasedItems = (
      await this.bookService.findAvailableCopiesByIsbnForPurchase(
        bookCopySearch.filter(
          (item) => item.transactionType == TransactionType.PURCHASE
        )
      )
    ).map(
      ({ book_isbn, id, at_position, image, title, status, usageCount }) => ({
        id: uuidv4(),
        isbn: book_isbn,
        cpy: id,
        position: at_position,
        image,
        title,
        status,
        usageCount,
      })
    );

    const selectedItemsCount = purchasedItems.length + loanItems.length;

    if (selectedItemsCount !== cart.cartItems.length) {
      throw new Error(
        `Failed to find all items selected: ${selectedItemsCount} != ${cart.cartItems.length}`
      );
    }

    if (purchasedItems.length) {
      const purchaseId = uuidv4();
      const bookPurchase: BookTransaction = {
        id: purchaseId,
        clientId: cart.userId,
        items: purchasedItems,
        createdAt: currentDate,
        transactionType: TransactionType.PURCHASE,
        status: [],
      };

      transactions["purchase"] = [bookPurchase];
    }
    await this.bookTransactionRepository.save(transactions);

    return transactions;
  }

  getUserTransactions(clientId: UserId): Promise<BookTransactions> {
    return this.bookTransactionRepository.getUserTransactions(clientId);
  }
}
