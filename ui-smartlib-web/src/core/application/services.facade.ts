import { BookService } from "@/book/application/services";
import { Cart } from "../domain/models";
import { BookLendingService, CartService } from "./services";
import { CartDto } from "./dto";
import { CartRepository } from "../domain/repositories";
import { defaultCartRepository } from "../infrastructure/repositories-impl";
import { defaultBookService } from "@/book/application/services-default";
import { defaultCartService } from "./services.default";
import { cartServiceApiClient } from "./services.gateway";

class CartServiceFacade {
  constructor(
    private cartRepository: CartRepository,
    private bookService: BookService,
    private cartService: CartService,
    private bookLendingService: BookLendingService
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
      await this.bookLendingService.initilizeCart(userId, bookEdition);
    } catch (error) {
      console.log(`ignore error ${error}`);
    }

    return cart;
  }

  async checkout(cartDto: CartDto): Promise<Cart> {
    let cart = await this.cartRepository.find(cartDto.cartId);
    let compartmentOperator = async () =>
      await this.bookLendingService.checkout(cart);
    return this.cartService.checkout(cart, compartmentOperator);
  }
}

export const cartServiceFacade = new CartServiceFacade(
  defaultCartRepository,
  defaultBookService,
  defaultCartService,
  cartServiceApiClient
);
