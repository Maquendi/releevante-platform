import {
  BookLoan,
  BookLoanItem,
  BookLoanItemStatus,
} from "../domain/loan.model";
import { CartDto, LoanItemStatusDto } from "./dto";
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
      createdAt: new Date(),
      itemId: dto.itemId,
      status:dto.status
    }
    
    return await this.bookLoanService.addLoanItemStatus(status);
  }
}
