import { BookServiceFacade } from "@/book/application/service.definitions";
import { Cart } from "../domain/cart.model";
import {
  BookLoan,
  BookLoanItem,
  BookLoanItemStatus,
  BookLoanStatus,
  LoanStatusValues,
} from "../domain/loan.model";
import { BookLoanService } from "./service.definition";
import { v4 as uuidv4 } from "uuid";
import { LoanRepository } from "../domain/repositories";

export class BookLoanServiceImpl implements BookLoanService {
  constructor(
    private bookLoanRepository: LoanRepository,
    private bookService: BookServiceFacade
  ) {}

  addLoanStatus(status: BookLoanStatus): Promise<BookLoanStatus> {
    return this.bookLoanRepository.addLoanStatus(status);
  }

  addLoanItemStatus(status: BookLoanItemStatus): Promise<BookLoanItemStatus> {
    return this.bookLoanRepository.addLoanItemStatus(status);
  }

  async checkout(cart: Cart): Promise<BookLoan> {
    const bookCopySearch = cart.cartItems.map(({ isbn, qty }) => ({
      isbn,
      qty,
    }));

    const bookCopies = await this.bookService.findAvailableCopiesByIsbn(
      bookCopySearch
    );

    const loanItems: BookLoanItem[] = bookCopies.map(
      ({ isbn, id, at_position }) => ({
        id: uuidv4(),
        isbn,
        cpy: id,
        position: at_position,
      })
    );

    const today = new Date();

    const returnsAt = today;

    returnsAt.setDate(returnsAt.getDate() + 5);

    const loanId = uuidv4();

    const loanStatus: BookLoanStatus = {
      id: uuidv4(),
      loanId: loanId,
      status: LoanStatusValues.CHECKING_OUT,
      createdAt: today,
    };

    const bookLoan: BookLoan = {
      id: loanId,
      clientId: cart.userId,
      loanItems: loanItems,
      createdAt: today,
      returnsAt: returnsAt,
      status: [loanStatus],
    };

    await this.bookLoanRepository.save(bookLoan);

    return bookLoan;
  }
}
