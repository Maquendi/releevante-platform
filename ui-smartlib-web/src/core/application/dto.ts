import { UserId } from "@/identity/domain/models";
import { BookCartItem, CartId } from "../domain/models";

export interface CartDto {
    cartId: CartId,
    userId: UserId,
    items: BookCartItem[]
}