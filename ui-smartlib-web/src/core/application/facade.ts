import { UserId } from "@/identity/domain/models";
import { Cart, CartId } from "../domain/cart.model";
import { CartDto } from "./dto";
import {
  CartService,
  BookLoanService,
} from "./service.definition";

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
   * @param initial payload to initialize a cart.
   * @returns
   */
  async initCart(user: UserId): Promise<CartId> {
    return this.cartService.initilizeCart(user).then((cart) => cart.id);
  }

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
