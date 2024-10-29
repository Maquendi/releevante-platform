import { BookEdition } from "@/book/domain/models";
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
import { CartDto, CartInit } from "./dto";

/**
 * default cart service
 */

export class DefaultCartService implements CartService {
  constructor(
    private bookService: BookService,
    private cartRepository: CartRepository
  ) {}

  async initilizeCart(initial: CartInit): Promise<Cart> {
    const bookCopies =
      await this.bookService.findAllBookCopiesAvailableLocallyByEdition(
        initial.bookEdition
      );
    // picking a copy to initialize cart.

    const selectedBookCopy = bookCopies?.find(
      (copy) => copy.status == "available"
    );

    if (!selectedBookCopy) {
      throw new Error(`no book with title ${initial.bookEdition.title} exists`);
    }

    const cartId = {
      value: uuidv4(),
    };

    const initialItem = {
      qty: 1,
      bookCopy: selectedBookCopy,
    };

    const cart = new Cart(cartId, initial.userId, [initialItem]);

    return this.cartRepository.save(cart);
  }

  async checkout(cart: Cart, extras: () => Promise<Cart>): Promise<Cart> {
    if (cart.state !== "PENDING") {
      throw new Error("Cart invalid state for checkout.");
    }

    cart.markForCheckout();
    return this.cartRepository.update(cart, extras);
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
    const bookEdition = await this.bookService.findBookEdition({
      id: initial.bookEdition.id,
    });

    if (!bookEdition) {
      throw new Error(`no book edition ${initial}`);
    }

    if (!bookEdition.availableLocally || !bookEdition.quantity) {
      throw new Error(`book ${initial} edition not available.`);
    }

    const cart = await this.cartService.initilizeCart(initial);

    try {
      await this.bookLendingService.initilizeCart(initial);
    } catch (error) {
      console.log(`ignore error ${error}`);
    }

    return cart;
  }

  /**
   *
   * @param cartDto cart dto,
   * @returns
   */
  async checkout(cartDto: CartDto): Promise<Cart> {
    let cart = await this.cartRepository.find(cartDto.cartId);

    cart.addItems(cartDto.items);

    return this.cartService.checkout(
      cart,
      async () => await this.bookLendingService.checkout(cart)
    );
  }
}
