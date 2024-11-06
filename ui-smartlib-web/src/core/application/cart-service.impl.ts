import { Cart, CartId } from "../domain/cart.model";
import { CartService } from "./service.definition";
import { CartRepository } from "../domain/repositories";
import { BookService } from "@/book/application/services";
import { v4 as uuidv4 } from "uuid";
import { CartDto } from "./dto";
import { UserId } from "@/identity/domain/models";
/**
 * default cart service
 */

export class DefaultCartService implements CartService {
  constructor(
    private bookService: BookService,
    private cartRepository: CartRepository
  ) {}

  async onCheckOutFailed(cart: Cart): Promise<Cart> {
    cart.markFailed();

    return await this.cartRepository.update(cart);
  }

  async initilizeCart(user: UserId): Promise<Cart> {
    const cartId = {
      value: uuidv4(),
    };

    const cart = new Cart(cartId, user, []);

    return this.cartRepository.save(cart);
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
