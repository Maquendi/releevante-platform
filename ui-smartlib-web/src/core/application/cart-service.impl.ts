import { Cart, CartItem } from "../domain/cart.model";
import { CartService } from "./service.definition";
import { CartRepository } from "../domain/repositories";
import { v4 as uuidv4 } from "uuid";
import { CartDto, CartInitDto } from "./dto";
import { arrayGroupinBy } from "@/lib/utils";
/**
 * default cart service
 */

export class DefaultCartService implements CartService {
  constructor(private cartRepository: CartRepository) {}

  async update(dto: CartDto): Promise<Cart> {
    const cart = await this.cartFromDto(dto);
    return await this.cartRepository.update(cart);
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

  async onCheckOutFailed(dto: CartDto): Promise<Cart> {
    const cart = await this.cartFromDto(dto);
    cart.markFailed();
    return await this.cartRepository.update(cart);
  }

  async onCheckOutSuccess(cart: Cart): Promise<Cart> {
    cart.markCheckedOut();
    return await this.cartRepository.update(cart);
  }

  /**
   *
   * @param cartDto cart dto,
   * @returns
   */
  async initCart(dto: CartInitDto): Promise<CartDto> {
    const userId = dto.userId;

    let cart = await this.cartRepository.findByUser(userId);

    if (cart?.id) {
      const cartItems: CartItem[] = [...cart.cartItems, dto.items] as any;

      const itemGrouped = arrayGroupinBy(cartItems, "isbn");
    } else {
      const cartItems = dto.items.map(({ isbn, qty, transactionType }) => ({
        id: uuidv4(),
        isbn,
        qty,
        transactionType,
      }));
      const cartId = {
        value: uuidv4(),
      };

      cart = await this.cartRepository.save(
        new Cart(cartId, userId, cartItems)
      );
    }

    return {
      id: cart.id,
      userId,
      items: cart.cartItems,
    };
  }

  async checkout(dto: CartDto): Promise<Cart> {
    const cart = await this.cartFromDto(dto);
    cart.markForCheckout();

    return this.cartRepository.save(cart);
  }
}
