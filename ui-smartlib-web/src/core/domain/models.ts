import { BookCopy } from "@/book/domain/models";
import { UserId } from "@/identity/domain/models";

export interface BookCartItem {
  bookCopy: BookCopy;
  qty: number;
}

export interface CartId {
  value: string;
}

export class Cart {
  public checkedOut: boolean = false;
  public state: 'PENDING' | 'CHECKED_OUT' | 'STALE' = "PENDING";
  constructor(
    public cartId: CartId,
    public userId: UserId,
    public items: BookCartItem[]
  ) {
    if (items.length == 0) {
      throw new Error("At least one item required to init cart");
    }
  }

  public addItems(items: BookCartItem[]): boolean {
    return true;
  }

  public markForCheckout(): boolean {
    if (this.checkedOut) {
      throw new Error("Cart already checked out");
    }

    /**
      check if this cart has any item at all, otherwise throw.
     */
    if (this.items.reduce((i, c) => i + c.qty, 0) == 0) {
      throw new Error("Invalid cart for checkout");
    }

    this.items = this.items.map((item) => {
      if (item.qty == 1) {
        item.bookCopy.status = "borrowed";
        item.bookCopy.is_available = false;
      }
      return item;
    });

    this.state = 'CHECKED_OUT'
    this.checkedOut = true;
    return this.checkedOut;
  }

  get cartItems(): BookCopy[] {
    return this.items.map((cartItem) => cartItem.bookCopy);
  }
}
