import { BookEdition } from "@/book/domain/models";
import { Cart } from "../domain/models";
import { UserId } from "@/identity/domain/models";

export interface CartService {
  initilizeCart(userId: UserId, bookEdition: BookEdition): Promise<Cart>;
  checkout(cart: Cart, extras: () => Promise<Cart>): Promise<Cart>;
}



export interface BookLendingService extends CartService {
  initilizeCart(userId: UserId, bookEdition: BookEdition): Promise<Cart>;
  checkout(cart: Cart): Promise<Cart>;
}