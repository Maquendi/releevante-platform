"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/config/i18n/routing";
import useGetBooks from "@/hooks/useGetCartBooks";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import RentItemsReview from "@/components/RentItemsReview";
import PurchaseItemsReview from "@/components/PurchaseItemsReview";
import { useAppSelector } from "@/redux/hooks";
import useSaveBookReservation from "@/hooks/useSaveBookReservation";

export default function ReviewCartPage() {
  const cartItems = useAppSelector(store=>store.cart.items)
  const { rentItems, purchaseItems, allItems } = useGetBooks(cartItems);
  const t = useTranslations("reviewMyCart");
  const router = useRouter();
  const saveBookReservationMutation = useSaveBookReservation()
  useEffect(() => {
    if (rentItems.length || purchaseItems.length) return;
    router.push("/catalog");
  }, [rentItems, purchaseItems, router]);

  return (
    <section className="grid grid-rows-[1fr_auto] h-[91.5dvh] ">
      <div
        suppressHydrationWarning
        className="overflow-y-auto px-4 py-4 space-y-6"
      >
        <RentItemsReview books={rentItems} />
        <PurchaseItemsReview books={purchaseItems} />
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
