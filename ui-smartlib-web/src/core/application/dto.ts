import { UserId } from "@/identity/domain/models";
import { BookCartItem, CartId } from "../domain/models";
import { BookEdition } from "@/book/domain/models";



export interface CartInit{
    userId: UserId, 
    bookEdition: BookEdition
}


export interface CartDto {
    cartId: CartId,
    userId: UserId,
    items: BookCartItem[]
}