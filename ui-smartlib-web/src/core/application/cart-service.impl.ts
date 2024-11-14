import { Cart } from "../domain/cart.model";
import { CartService } from "./service.definition";
import { CartRepository } from "../domain/repositories";
import { BookServiceFacade } from "@/book/application/service.definitions";
import { v4 as uuidv4 } from "uuid";
import { CartDto } from "./dto";
/**
 * default cart service
 */

export class DefaultCartService implements CartService {
  constructor(
    private bookService: BookServiceFacade,
    private cartRepository: CartRepository
  ) {}

  async onCheckOutFailed(cart: Cart): Promise<Cart> {
    cart.markFailed();

    return await this.cartRepository.update(cart);
  }

  async checkout(dto: CartDto): Promise<Cart> {
    const cartItems = dto.items.map(({ isbn, qty }) => ({
      id: uuidv4(),
      isbn,
      qty,
    }));

    const cartId = {
      value: uuidv4(),
    };
    const userId = dto.userId;

    const cart = new Cart(cartId, userId, cartItems);

    cart.markForCheckout();

    return this.cartRepository.save(cart);
  }
}
