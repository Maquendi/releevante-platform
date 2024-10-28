import { BookEdition } from "@/book/domain/models";
import { Cart } from "../domain/models";
import { CartService } from "./services";
import { CartRepository } from "../domain/repositories";
import { BookService } from "@/book/application/services";
import { v4 as uuidv4 } from "uuid";
import { UserId } from "@/identity/domain/models";
import { defaultCartRepository } from "../infrastructure/repositories-impl";
import { defaultBookService } from "@/book/application/services-default";

class DefaultCartService implements CartService {
  constructor(
    private bookService: BookService,
    private cartRepository: CartRepository
  ) {}

  async initilizeCart(userId: UserId, bookEdition: BookEdition): Promise<Cart> {
    const bookCopies =
      await this.bookService.findAllBookCopiesAvailableLocallyByEdition(
        bookEdition
      );
    // picking a copy to initialize cart.

    const selectedBookCopy = bookCopies?.find(
      (copy) => copy.status == "available"
    );

    if (!selectedBookCopy) {
      throw new Error(`no book with title ${bookEdition.title} exists`);
    }

    const cartId = {
      value: uuidv4(),
    };

    const initialItem = {
      qty: 1,
      bookCopy: selectedBookCopy,
    };

    const cart = new Cart(cartId, userId, [initialItem]);

    return this.cartRepository.save(cart);
  }

  async checkout(cart: Cart, args: () => Promise<Cart>): Promise<Cart> {
    cart.markForCheckout();
    return this.cartRepository.update(cart, args);
  }
}

export const defaultCartService = new DefaultCartService(
  defaultBookService,
  defaultCartRepository
);
