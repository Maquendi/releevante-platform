import { BookCopy } from "@/book/domain/models";
import { UserId } from "@/identity/domain/models";
import { inCartItemsDto } from "../application/dto";

export interface BookCartItem {
  bookCopy: BookCopy;
  qty: number;
}

export interface CartId {
  value: string;
}



export class Cart {
  public state: "PENDING" | "CHECKED_OUT" | 'CHECKING_OUT' | 'CHECKOUT_FAILED' | "STALE" = "PENDING";
  constructor(
    public cartId: CartId,
    public userId: UserId,
    public items: inCartItemsDto[],
    public isCartInit?:boolean,


  ) {
    if (!this.isCartInit && items.length == 0) {
      throw new Error("At least one item required to init cart");
    }
  }

  public addItems(newItems: inCartItemsDto[]): boolean {


   this.items=[...this.items,...newItems]

    return true;
  }

  public markForCheckout(): boolean {
    if (this.isCheckedOut) {
      throw new Error("Cart already checked out");
    }

    /**
      check if this cart has any item at all, otherwise throw.
     */
    if (this.items.reduce((i, c) => i + c.qty, 0) == 0) {
      throw new Error("Invalid cart for checkout");
    }


    this.state = "CHECKING_OUT";
    return true;
  }

  public markFailed(): boolean {

    this.state = "CHECKOUT_FAILED";
    return true;
  }

  get cartItems(): inCartItemsDto[] {
    // return this.items.map((cartItem) => cartItem.book_copy_id);
    return this.items
  }

  public get isCheckedOut(): boolean {
    return this.state === "CHECKED_OUT";
  }
}
