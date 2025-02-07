import { UserId } from "@/identity/domain/models";
import {
  BookTransaction,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
} from "../domain/loan.model";
import {
  BookTransactionService,
  BookTransactionServiceFacade,
} from "./service.definition";
import { CartDto } from "./dto";
import { v4 as uuidv4 } from "uuid";
import { Cart } from "../domain/cart.model";

export class DefaultBookTransactionServiceFacade
  implements BookTransactionServiceFacade
{
  constructor(private bookTransactionService: BookTransactionService) {}

  async checkout(cartDto: CartDto): Promise<BookTransactions> {
    const cart = await this.cartFromDto(cartDto);
    return this.bookTransactionService.checkout(cart);
  }

  async addLoanItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus> {
    return this.bookTransactionService.addLoanItemStatus({
      ...status,
      createdAt: new Date().toISOString(),
    });
  }

  async addLoanStatus(
    status: BookTransactionStatus
  ): Promise<BookTransactionStatus> {
    return this.bookTransactionService.addLoanStatus({
      ...status,
      createdAt: new Date().toISOString(),
    });
  }

  async getUserLoans(clientId: UserId): Promise<BookTransaction[]> {
    return this.bookTransactionService.getUserLoans(clientId);
  }

  async cartFromDto(dto: CartDto): Promise<Cart> {
    const cartItems = dto.items.map(
      ({ id = uuidv4(), isbn, qty, transactionType }) => ({
        id,
        isbn,
        qty,
        transactionType,
      })
    );

    const cartId = {
      value: dto.id?.value || uuidv4(),
    };
    return new Cart(cartId, dto.userId, cartItems);
  }
}
