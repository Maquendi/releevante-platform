import { UserId } from "@/identity/domain/models";

export type CartItemDto = {
  isbn: string;
  qty: number;
};

export interface CartDto {
  userId: UserId;
  items: CartItemDto[];
}
