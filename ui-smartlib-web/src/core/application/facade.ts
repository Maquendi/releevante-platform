import { UserId } from "@/identity/domain/models";
import { Cart, CartId } from "../domain/cart.model";
import { CartDto } from "./dto";
import { CartService, BookLoanService } from "./service.definition";

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
  async checkout(dto: CartDto): Promise<Cart> {
    const cart = await this.cartService.checkout(dto);

    try {
      await this.bookLoanService.checkout(cart);
    } catch (error) {
      await this.cartService.onCheckOutFailed(cart);
    }
    return cart;
  }
}
