import { BookServiceFacade } from "@/book/application/service.definitions";
import { Cart } from "../domain/cart.model";
import { BookLoan, BookLoanDetail } from "../domain/loan.model";
import {
  BookLoanService,
  BridgeIoApiClient,
  CoreApiClient,
} from "./service.definition";
import { v4 as uuidv4 } from "uuid";
import { LoanRepository, TransactionCallback } from "../domain/repositories";

export class BookLoanServiceImpl implements BookLoanService {
  constructor(
    private bookLoanRepository: LoanRepository,
    private bookService: BookServiceFacade,
    coreApiClient: CoreApiClient,
    private bridgeIoClient: BridgeIoApiClient
  ) {}

  // interact with bridge.io for door/compartment opening.
  async checkout(cart: Cart): Promise<BookLoan> {
    const bookCopySearch = cart.cartItems.map(({ isbn, qty }) => ({ isbn, qty }));

    const bookCopies = await this.bookService.findAvailableCopiesByIsbn(
      bookCopySearch
    );

    const loanDetails: BookLoanDetail[] = bookCopies.map(({ isbn, id }) => ({
      id: uuidv4(),
      isbn,
      book_copy_id: id,
    }));

    const bookLoan: BookLoan = {
      id: uuidv4(),
      cartId: cart.id,
      userId: cart.userId,
      itemsCount: bookCopies.length,
      status: "onschedule",
      details: loanDetails,
      startTime: new Date(),
      endTime: new Date(),
    };

    const compartments = bookCopies.map((book) => ({
      compartment: book.at_position,
    }));

    const transactionCb: TransactionCallback = {
      execute: async () => this.bridgeIoClient.openCompartments(compartments),
    };

    await this.bookLoanRepository.save(bookLoan, bookCopies, transactionCb);

    return bookLoan;
  }
}
