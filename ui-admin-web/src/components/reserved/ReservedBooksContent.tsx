'use client'

import useGetReservedBooks from "@/hooks/useGetReservedBooks"
import MaxWithWrapper from "../MaxWithWrapper"
import NotReservedBooksFound from "./NotReservedBooksFound"
import RentItemsReview from "../RentItemsReview"
import PurchaseItemsReview from "../PurchaseItemsReview"
import Loading from "../Loading"

export default function ReservedBooksContent() {
  const {rentItems,purchaseItems,isPending}=useGetReservedBooks()

  if(isPending){
    return (
      <div className="grid place-content-center min-h-[50svh]">
        <Loading/>
      </div>
    )
  }
  return (
    <section>
    <MaxWithWrapper className="space-y-3 mt-7">
      <RentItemsReview isReservedBooks books={rentItems as any} />
      <PurchaseItemsReview books={purchaseItems as any[]} />
      <NotReservedBooksFound/>
    </MaxWithWrapper>
  </section>
  )
}
