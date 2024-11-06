import { UserId } from "@/identity/domain/models";
import { CartId } from "../domain/cart.model";

export type CartItemDto = {
  isbn: string;
  qty: number;
};

export interface CartDto {
  userId: UserId
  items: CartItemDto[];
}
