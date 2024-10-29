import { CartInit } from "../application/dto";
import { BackendApiClient } from "../application/service.definition";
import { Cart } from "../domain/models";

export class CoreApiClient implements BackendApiClient {
  async initilizeCart(initial: CartInit): Promise<any> {
    return {};
  }
  async checkout(cart: Cart): Promise<Cart> {
    return cart;
  }
}
