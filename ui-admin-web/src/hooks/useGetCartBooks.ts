import { ReservationItem } from "@/types/book";
import { useMemo } from "react";

export default function useGetCartBooks<T extends ReservationItem>(cartItems:T[]) {

  const rentItems = useMemo(() => {
    return cartItems?.filter((item) => item.transactionType === "RENT") || [];
  }, [cartItems]);

  const purchaseItems = useMemo(() => {
    return (
      cartItems?.filter((item) => item.transactionType === "PURCHASE") || []
    );
  }, [cartItems]);

  return { purchaseItems, rentItems,allItems:cartItems };
}