import { BookService } from "@/book/application/services";
import { Cart } from "../domain/models";
import { CartService } from "./services";
import { CartDto } from "./dto";
import { CartRepository } from "../domain/repositories";

class CartServiceFacade {
  constructor(
    private cartRepository: CartRepository,
    private bookService: BookService,
    private cartService: CartService,
    private cartServiceApiClient: CartService
  ) {}

  async initCart(user: { id: string }, edition: { id: string }): Promise<Cart> {
    const bookEdition = await this.bookService.findBookEdition(edition);

    if (!bookEdition) {
      throw new Error(`no book edition ${edition}`);
    }

    if (!bookEdition.availableLocally || !bookEdition.quantity) {
      throw new Error(`book ${edition} edition not available.`);
    }

    const userId = {
      value: user.id,
    };

    const cart = await this.cartService.initilizeCart(userId, bookEdition);

    try {
      await this.cartServiceApiClient.initilizeCart(userId, bookEdition);
    } catch (error) {
      console.log("ignore error");
    }

    return cart;
  }

  async checkout(cartDto: CartDto): Promise<Cart> {


    let cart = await this.cartRepository.find(cartDto.cartId);


    cart.cartItems[0].compartment

    return this.cartService.checkout(cart);
  }
}
