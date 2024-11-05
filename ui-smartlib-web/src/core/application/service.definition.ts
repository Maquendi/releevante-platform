import { BookCompartment } from "@/book/domain/models";
import { Cart } from "../domain/models";
import { CartInit,inCartItemsDto, PrepareCart } from "./dto";

export interface CartService {
  initilizeCart(initial: CartInit): Promise<Cart>;
  checkout(cart: Cart): Promise<Cart>;
  prepareCartItems(init:PrepareCart):Promise<inCartItemsDto[]>
  updateCartState(cart:Cart):Promise<any>
}

export interface BookLendingService extends CartService {
  initilizeCart(initial: CartInit): Promise<Cart>;
  checkout(cart: Cart): Promise<Cart>;
}

export interface BackendApiClient {
  initilizeCart(initial: CartInit): Promise<any>;
  checkout(cart: Cart): Promise<Cart>;
}

export interface BridgeIoApiClient {
  openCompartments(comparments: BookCompartment[]): Promise<any>;
}
