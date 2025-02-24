import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";

export default function useGetCartBooks() {
  const cartState = useAppSelector((state) => state.cart.items);

  const cartItems = useMemo(()=>{
    return cartState.filter(item=>item.state === 'IN_CART')
  },[cartState])

  const reservedItems = useMemo(()=>{
    return cartState.filter(item=>item.state === 'RESERVED')
  },[cartItems])


  const rentItems = useMemo(() => {
    return cartItems.filter((item) => item.transactionType === "RENT" ) || [];
  }, [cartItems]);

  const purchaseItems = useMemo(() => {
    return (
      cartItems.filter((item) => item.transactionType === "PURCHASE") || []
    );
  }, [cartItems]);

  const reservedRentItems = useMemo(() => {
    return reservedItems.filter((item) => item.transactionType === "RENT" ) || [];
  }, [cartItems]);

  const reservedPurchaseItems = useMemo(() => {
    return (
      reservedItems.filter((item) => item.transactionType === "PURCHASE") || []
    );
  }, [cartItems]);

  const inCartItemsCount = useMemo(() => {
    return (
      cartItems.filter((item) => item.state === 'IN_CART')?.length || 0
    );
  }, [cartItems]);

  return { inCartItemsCount,purchaseItems, rentItems,reservedRentItems,reservedPurchaseItems,reservedItems};
}
