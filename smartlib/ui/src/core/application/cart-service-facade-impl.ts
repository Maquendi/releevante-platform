import { Cart } from "../domain/cart.model";
import {
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
} from "../domain/loan.model";
import { CartDto, CartInitDto, LoanItemStatusDto, LoanStatusDto } from "./dto";
import { CartService, BookTransactionService, TransactionItemStatusDto } from "./service.definition";
import { v4 as uuidv4 } from "uuid";

/***
 * A cart service facade
 */
export class CartServiceFacade {
  constructor(
    private cartService: CartService,
    private bookLoanService: BookTransactionService
  ) {}

  /**
   *
   * @param cartDto cart dto,
   * @returns
   */
  async checkout(dto: CartDto): Promise<BookTransactions> {
    try {
      const cart = await this.cartService.checkout(dto);
      console.log("cart checkout dto", dto);
      return await this.bookLoanService.checkout(cart);
    } catch (error) {
      console.log(error);
      await this.cartService.onCheckOutFailed(dto);
      throw error;
    }
  }

  /**
   *
   * @param cartDto cart dto,
   * @returns
   */
  async initCart(dto: CartInitDto): Promise<CartDto> {
    return this.cartService.initCart(dto);
  }

  async newLoanItemStatus(
    dto: TransactionItemStatusDto
  ): Promise<BookTransactionItemStatus> {
    const status: BookTransactionItemStatus = {
      ...dto,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    return await this.bookLoanService.newTransactionItemStatus(status);
  }

  async newLoanStatus(dto: LoanStatusDto): Promise<BookTransactionStatus> {
    const status: BookTransactionStatus = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      transactionId: dto.loanId,
      status: dto.status,
    };
    return await this.bookLoanService.newTransactionStatus(status);
  }
}
