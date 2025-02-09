import { UserId } from "@/identity/domain/models";
import { TransactionType } from "./loan.model";

export interface CartId {
  value: string;
}

export interface CartItem {
  id: string;
  isbn: string;
  qty: number;
  transactionType: TransactionType;
}

const enum CartStatusEnum {
  PENDING = "PENDING",
  CHECKED_OUT = "CHECKED_OUT",
  CHECKING_OUT = "CHECKING_OUT",
  CHECKOUT_FAILED = "CHECKOUT_FAILED",
  STALE = "STALE",
}

export class Cart {
  state: CartStatusEnum = CartStatusEnum.PENDING;

  constructor(
    public id: CartId,
    public userId: UserId,
    private items: CartItem[]
  ) {}

  public addItems(newItems: CartItem[]): boolean {
    this.items = [...this.items, ...newItems];
    return true;
  }

  get cartItems(): CartItem[] {
    // return this.items.map((cartItem) => cartItem.book_copy_id);
    return this.items;
  }
}
