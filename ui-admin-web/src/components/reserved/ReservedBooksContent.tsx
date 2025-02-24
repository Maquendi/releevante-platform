'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import MaxWithWrapper from "../MaxWithWrapper"
import PurchaseItemsReview from "../PurchaseItemsReview"
import RentItemsReview from "../RentItemsReview"
import NotReservedBooksFound from "./NotReservedBooksFound"
import { setItemsAsReserved } from "@/redux/features/cartSlice"
import { useEffect } from "react"
import useGetCartBooks from "@/hooks/useGetCartBooks"

export default function ReservedBooksContent() {
  const dispath = useAppDispatch()
  const cartItems = useAppSelector(store=>store.cart.items)

  useEffect(()=>{
    if(cartItems?.length){
      dispath(setItemsAsReserved())
    }
  },[])

  const {reservedItems,reservedPurchaseItems,reservedRentItems}=useGetCartBooks()
  
  return (
    <section>
    <MaxWithWrapper className="space-y-3 mt-7">
      <RentItemsReview books={reservedRentItems} isReservedBooks />
      <PurchaseItemsReview books={reservedPurchaseItems} />
      {!reservedItems?.length && (
        <NotReservedBooksFound/>
      )}
    </MaxWithWrapper>
  </section>
  )
}
