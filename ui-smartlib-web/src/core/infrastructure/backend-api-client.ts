import { CoreApiClient } from "../application/service.definition";
import { Cart } from "../domain/cart.model";

export class CoreApiClientImpl implements CoreApiClient {

  constructor() {}


  async checkout(cart: Cart): Promise<Cart> {
    return cart;
  }
}
