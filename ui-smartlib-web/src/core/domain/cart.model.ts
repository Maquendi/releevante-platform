import { UserId } from "@/identity/domain/models";

export interface CartId {
  value: string;
}

export interface CartItem {
  id: string;
  isbn: string;
  qty: number;
  transactionType:'RENT' | 'PURCHASE'
}

export class Cart {
  public state:
    | "PENDING"
    | "CHECKED_OUT"
    | "CHECKING_OUT"
    | "CHECKOUT_FAILED"
    | "STALE" = "PENDING";
  constructor(
    public id: CartId,
    public userId: UserId,
    private items: CartItem[]
  ) {}

  public addItems(newItems: CartItem[]): boolean {
    this.items = [...this.items, ...newItems];
    return true;
  }

  public markForCheckout(): boolean {
    this.state = "CHECKING_OUT";
    return true;
  }

  public markasCheckedOut(): boolean {
    if (this.state !== "CHECKING_OUT") {
      throw new Error("Cart invalid state for checkout.");
    }

    this.state = "CHECKED_OUT";
    this.items = this.items.map((book) => ({ ...book, is_available: false }));
    return true;
  }

  public markFailed(): boolean {
    this.state = "CHECKOUT_FAILED";
    return true;
  }

  get cartItems(): CartItem[] {
    // return this.items.map((cartItem) => cartItem.book_copy_id);
    return this.items;
  }

  public get isCheckedOut(): boolean {
    return this.state === "CHECKED_OUT";
  }
}
