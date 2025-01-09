import { UserId } from "@/identity/domain/models";
import {
  BookLoan,
  BookLoanItem,
  BookLoanItemStatus,
  BookLoanStatus,
  LoanGroup,
} from "../domain/loan.model";
import { CartDto, LoanItemStatusDto, LoanStatusDto } from "./dto";
import { CartService, BookLoanService } from "./service.definition";
import { v4 as uuidv4 } from "uuid";

/***
 * A cart service facade
 */
export class CartServiceFacade {
  constructor(
    private cartService: CartService,
    private bookLoanService: BookLoanService
  ) {}

  /**
   *
   * @param cartDto cart dto,
   * @returns
   */
  async checkout(dto: CartDto): Promise<BookLoan> {
    const cart = await this.cartService.checkout(dto);
    console.log('cart checkout dto',dto)
    try {
      return await this.bookLoanService.checkout(cart);
    } catch (error) {
      console.log(error);
      await this.cartService.onCheckOutFailed(cart);
      throw error;
    }
  }

  async newLoanItemStatus(dto: LoanItemStatusDto): Promise<BookLoanItemStatus> {
    const status: BookLoanItemStatus = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      itemId: dto.itemId,
      status: dto.status,
    };
    return await this.bookLoanService.addLoanItemStatus(status);
  }

  async newLoanStatus(dto: LoanStatusDto): Promise<BookLoanStatus> {
    const status: BookLoanStatus = {
      id: uuidv4(),
      createdAt: new Date(),
      loanId: dto.loanId,
      status: dto.status,
    };
    return await this.bookLoanService.addLoanStatus(status);
  }

  getUserLoanBooks(clientId: UserId): Promise<LoanGroup[]> {
    return this.bookLoanService.getUserLoanBooks(clientId)
  }
}
