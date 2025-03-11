'use client'

import MaxWithWrapper from "../MaxWithWrapper"
import NotReservedBooksFound from "./NotReservedBooksFound"
import RentItemsReview from "../RentItemsReview"
import PurchaseItemsReview from "../PurchaseItemsReview"
import Loading from "../Loading"
import useGetReservedBooks from "@/hooks/useGetReservedBooks"

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
      {!isPending && (!rentItems?.length && !purchaseItems?.length) ? (
        <NotReservedBooksFound/>
      ):null}
    </MaxWithWrapper>
  </section>
  )
}
