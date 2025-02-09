import { UserId } from "@/identity/domain/models";
import {
  BookTransaction,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
  TransactionItemStatusEnum,
  TransactionStatusEnum,
} from "../domain/loan.model";
import {
  BookTransactionService,
  BookTransactionServiceFacade,
  TransactionItemStatusDto,
  TransactionStatusDto,
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

  async newTransactionItemStatus(
    status: TransactionItemStatusDto
  ): Promise<BookTransactionItemStatus> {
    return this.bookTransactionService.newTransactionItemStatus({
      ...status,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    });
  }

  async newTransactionStatus(
    status: TransactionStatusDto
  ): Promise<BookTransactionStatus> {
    return this.bookTransactionService.newTransactionStatus({
      id: uuidv4(),
      status: status.status,
      transactionId: status.transactionId,
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
