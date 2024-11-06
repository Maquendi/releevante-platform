 'use client'

import { checkout } from "@/actions/cart-actions"
import { RootState } from "@/redux/store"
import Image from "next/image"
import { useSelector } from "react-redux"

 export default function CartItemsList(){
    const cartItems= useSelector((state:RootState)=>state.cart.items)
    return(
      <div className="px-10 mt-10">
        <div className="flex justify-between mt-5">
        <h3 className="text-3xl font-bold">Checkout page</h3>
        <button className="p-3 rounded-md bg-blue-400" onClick={()=>checkout(cartItems)}>Checkout</button>
        </div>
          <div>
            {
              cartItems?.length ? (
                cartItems.map(item=>(
                  <article key={item.isbn} className="grid grid-cols-2 gap-2 p-2 rounded-md">
                      <figure>
                          <Image className=" object-cover" src={item.image} width={200} height={200} alt="name"></Image>
                      </figure>
                      <div>
                           <p>{item.title}</p>
                          <p>Quantity: <span>{item.qty}</span></p>
                      </div>
                  </article>
              ))
              ):(
                <div>
                  <h2 className="mt-10 font-semibold">No tiene elementos en el carrito</h2>
                </div>
              )
            }
        </div>
      </div>
    )
 }