'use server'
import { cartServiceFacade } from "@/core/application";
import { CartItem } from "@/core/application/dto";
import { cookies } from 'next/headers'

export const addItemToCart =async(cartItem:CartItem):Promise<{cart_id:string}>=>{
    const cookieStore = await cookies()
    try {
        const cartIdCookie=cookieStore.get('CART_ID')
        if(cartIdCookie)return{cart_id:cartIdCookie.value}

        const cart = await cartServiceFacade.initCart({userId:{value:'asds-dsds-dsds-dsds'},cartItem})
        cookieStore.set('CART_ID',cart.cartId.value)
        return {
            cart_id:cart.cartId.value
        }
    } catch (error) {
        console.log('error new cart action' + error)
        throw new Error('Creating cart id ' + error)
    }
}


export const checkout =async(cartItems:CartItem[]):Promise<any>=>{
    const cookieStore = await cookies()

    console.log('cart items',cartItems)

    try {
        const cartIdCookie=cookieStore.get('CART_ID')?.value
        if(!cartIdCookie)throw new Error('Cart id not valid')

        const userId={
            value:''
        }
        const cartId={
            value:cartIdCookie
        }
         await cartServiceFacade.checkout({userId,cartId,items:cartItems})
         return
        
    } catch (error) {
        console.log('error new cart action' + error)
        throw new Error('Creating cart id ' + error)
    }
}