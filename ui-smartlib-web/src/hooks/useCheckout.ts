import { useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { checkout } from "@/actions/cart-actions";
import { clearCart } from "@/redux/features/cartSlice";
import { clearCheckout } from "@/redux/features/checkoutSlice";
import { useRouter } from "@/config/i18n/routing";

export function useCheckout() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { currentBook, completedBooks } = useAppSelector(
    (state) => state.checkoutReducer
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const hasClearedData = useRef(false); // Ref para evitar la repetición de despachos

  const { mutate: addCartItemsMutation } = useMutation({
    mutationFn: checkout,
    onSuccess(data) {
      const copies = data.loanItems;
      dispatch({ type: "socket/emit", event: "checkout", payload: copies });
    },
  });

  useEffect(() => {
    if (!cartItems || cartItems?.length === 0) return;
    addCartItemsMutation(cartItems);
  }, [cartItems, addCartItemsMutation]);

  const currentBookShowing = useMemo(() => {
    return (
      cartItems.find((item) => item.isbn === currentBook.isbn) || cartItems?.[0]
    );
  }, [currentBook, cartItems]);

  const clearAllData = () => {
    if (hasClearedData.current) return; 
    dispatch(clearCart());
    dispatch(clearCheckout());
    hasClearedData.current = true; 
  };

  useEffect(() => {
    const isAllBookProcessed = completedBooks.every(
      (item) => item.status === "checkout_successful"
    );
    if (isAllBookProcessed && completedBooks.length === cartItems.length) {
      clearAllData(); // Llama solo una vez
      router.push("/checkout/thanks");
    }
  }, [cartItems, completedBooks, router]);

  return {
    cartItems,
    currentBook,
    completedBooks,
    currentBookShowing,
  };
}
