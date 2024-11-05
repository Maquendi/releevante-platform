import { Cart } from "../domain/models";
import {
  BackendApiClient,
  BookLendingService,
  BridgeIoApiClient,
  CartService,
} from "./service.definition";
import { CartRepository } from "../domain/repositories";
import { BookService } from "@/book/application/services";
import { v4 as uuidv4 } from "uuid";
import { BookRepository } from "@/book/domain/repositories";
import { CartDto, CartInit, PrepareCart,inCartItemsDto
} from "./dto";
/**
 * default cart service
 */

export class DefaultCartService implements CartService {
  constructor(
    private bookService: BookService,
    private cartRepository: CartRepository
  ) {}

  async initilizeCart(initial: CartInit): Promise<Cart> {
    const cartId = {
      value: uuidv4(),
    };

    const cart = new Cart(cartId,initial.userId,[],true)

    return this.cartRepository.save(cart);
  }

  async prepareCartItems(init: PrepareCart): Promise<inCartItemsDto[]> {
    const cartItemPromises = init.items.map(async (item) => {

      const availableBookCopies =
        await this.bookService.findBookAvailableCopies({
          book_id: item.book_id,
          edition_id: item.edition_id,
        },item.qty);

     
    if (availableBookCopies.length < item.qty!) {
      throw new Error(`Not enough copies available for book ${item.title}`);
    }

    const cartItems = availableBookCopies.map((bookCopy) => ({
      qty: 1, 
      cart_id: init.cartId.value,
      book_copy_id: bookCopy.id,
      is_available: false,
    }));

      return cartItems;
    });

    const preparedCartItems = await Promise.all(cartItemPromises);

    return preparedCartItems.flat();
  }

  async updateCartState(cart:Cart){
    cart.markFailed()
    await this.cartRepository.updateCartState(cart)
  }

  async checkout(cart: Cart): Promise<Cart> {
    if (cart.state !== "PENDING") {
      throw new Error("Cart invalid state for checkout.");
    }

    cart.markForCheckout();

    return this.cartRepository.update(cart);
  }
}

/**
 * an api client to communicate with main backend.
 */

export class CartServiceApiClient implements BookLendingService {
  constructor(
    private backendApiClient: BackendApiClient,
    private bridgeApiClient: BridgeIoApiClient,
    private bookRepository: BookRepository
  ) {}

  // interact with backend api for cart initialization
  async initilizeCart(initial: CartInit): Promise<Cart> {
    await this.backendApiClient.initilizeCart(initial);

    throw new Error("Method not implemented.");
  }

  // interact with bridge.io for door/compartment opening.
  async checkout(cart: Cart): Promise<Cart> {
    const compartments = await this.bookRepository.findBookCompartments(
      cart.cartItems
    );
    return Promise.all([
      this.bridgeApiClient.openCompartments(compartments),
      this.backendApiClient.checkout(cart),
    ]).then((v) => cart);
  }
}

/***
 * A cart service facade
 */
export class CartServiceFacade {
  constructor(
    private cartRepository: CartRepository,
    private bookService: BookService,
    private cartService: CartService,
    private bookLendingService: BookLendingService
  ) {}

  /**
   *
   * @param initial payload to initialize a cart.
   * @returns
   */
  async initCart(initial: CartInit): Promise<Cart> {

    const cart = await this.cartService.initilizeCart(initial);
    return cart;
  }

 
  /**
   *
   * @param cartDto cart dto,
   * @returns
   */
  async checkout(cartDto: CartDto): Promise<Cart> {

    const cartItems = await this.cartService.prepareCartItems(cartDto)

    const cart = new Cart(cartDto.cartId,cartDto.userId,cartItems)

    cart.addItems(cartItems);

    await this.cartService.checkout(cart);

    // try {
    //   await this.bookLendingService.checkout(cart)

    // } catch (error) {
    //   // await this.cartService.updateCartState(cart)
    // }
    return cart
  }
}
