import { Cart, CartId } from "./models";

export interface CartRepository {
  save(cart: Cart): Promise<Cart>;
  update(cart: Cart, extras: () => Promise<Cart>): Promise<Cart>;
  find(cartId: CartId): Promise<Cart>;
}
