import { UserId } from "@/identity/domain/models";
import {  CartId } from "../domain/models";


export type CartItem={
    book_id:string,
    edition_id:string
    qty?: number
    title:string
}

export interface inCartItemsDto{
    cart_id:string,
    book_copy_id:string
    is_available:boolean
    qty:number
  }
  

export interface CartInit{
    userId: UserId, 
    cartItem: CartItem
}

export interface PrepareCart{
    cartId: CartId,
    items: CartItem[]
  }
  


export interface CartDto {
    cartId: CartId,
    userId: UserId,
    items: CartItem[]
}