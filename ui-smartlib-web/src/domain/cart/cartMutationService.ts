import { InsertCart, InsertCartDetails } from "@/config/drizzle/schemas";
import { dbDelete, dbPost, dbPut } from "@/lib/drizzle-client";

export async function createCart(input:InsertCart) {
    try {
        const data = await dbPost('cart_schema',input)
        return data
    } catch (error) {
        throw new Error('Error adding item to cart' + error)
    }
}

export async function addItem(input:InsertCartDetails) {
    try {
        const data = await dbPost('cart_details_schema',input)
        return data
    } catch (error) {
        throw new Error('Error adding item to cart' + error)
    }
}

export async function update({quantity,cartDetailsId}:{quantity:number,cartDetailsId:string}) {
    try {
        const data = await dbPut('cart_details_schema',cartDetailsId,{
            quantity,
        })
        return data
    } catch (error) {
        throw new Error('Error adding item to cart' + error)
    }
}

export async function deleteItem({cartDetailsId}:{cartDetailsId:string}) {
    try {
        const data = await dbDelete('cart_details_schema',cartDetailsId)
        return data
    } catch (error) {
        throw new Error('Error adding item to cart' + error)
    }
}