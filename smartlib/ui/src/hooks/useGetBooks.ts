import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";

export default function useGetBooks() {
  const cartItems = useAppSelector((state) => state.cart.items);

  const rentItems = useMemo(() => {
    return cartItems.filter((item) => item.transactionType === "RENT") || [];
  }, [cartItems]);

  const purchaseItems = useMemo(() => {
    return (
      cartItems.filter((item) => item.transactionType === "PURCHASE") || []
    );
  }, [cartItems]);

  return { purchaseItems, rentItems };
}
