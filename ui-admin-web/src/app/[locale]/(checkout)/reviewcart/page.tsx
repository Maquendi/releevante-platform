"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import RentItemsReview from "@/components/RentItemsReview";
import PurchaseItemsReview from "@/components/PurchaseItemsReview";
import useSaveBookReservation from "@/hooks/useSaveBookReservation";
import { CartItem } from "@/components/Cartitem";
import useGetReviewCartBooks from "@/hooks/useGetReviewCartBooks";

export default function ReviewCartPage() {
  const t = useTranslations("reviewMyCart");
  const {
    rentItems,
    purchaseItems,
    allItems,
    handleMoveBook,
    handleRemoveItem,
  } = useGetReviewCartBooks();
  const saveBookReservationMutation = useSaveBookReservation();


  return (
    <section className="grid grid-rows-[1fr_auto] h-[91.5dvh] ">
      <div
        suppressHydrationWarning
        className="overflow-y-auto px-4 py-4 space-y-6"
      >
        <RentItemsReview bookCount={rentItems?.length || 0}>
          {rentItems.map((item) => {
            return (
              <CartItem
                key={item.isbn}
                item={item as any}
                itemType="RENT"
                moveItem={handleMoveBook}
                removeItem={handleRemoveItem}
              />
            );
          })}
        </RentItemsReview>
        <PurchaseItemsReview bookCount={purchaseItems?.length || 0}>
          {purchaseItems.map((item) => {
            return (
              <CartItem
                key={item.isbn}
                item={item as any}
                itemType="PURCHASE"
                moveItem={handleMoveBook}
                removeItem={handleRemoveItem}
              />
            );
          })}
        </PurchaseItemsReview>
      </div>
      <div className="flex justify-center items-center h-[80px]  bottom-0 right-0 left-0  py-1 px-5 bg-white">
        <Button
          className="m-auto bg-primary rounded-full py-6 px-7 hover:text-black border-primary"
          disabled={saveBookReservationMutation.isPending}
          onClick={async () =>
            await saveBookReservationMutation.mutateAsync(allItems)
          }
        >
          <span className="first-letter:uppercase"> {t("continue")}</span>
        </Button>
      </div>
    </section>
  );
}
