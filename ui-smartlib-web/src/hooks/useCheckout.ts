import { useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { checkout } from "@/actions/cart-actions";
import { clearCart } from "@/redux/features/cartSlice";
import { clearCheckout } from "@/redux/features/checkoutSlice";
import { useRouter } from "@/config/i18n/routing";
import { TransactionItemStatusEnum } from "@/core/domain/loan.model";

export function useCheckout() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { currentBook, completedBooks } = useAppSelector(
    (state) => state.checkout
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const hasClearedData = useRef(false);
  const hasCheckedOut = useRef(false);

  const { mutate: addCartItemsMutation } = useMutation({
    mutationFn: checkout,
    onSuccess(data) {
      dispatch({ type: "socket/checkout", event: "checkout", payload: data });
    },
    onError(error) {
      console.log("error on checkout");
      if (error?.message?.includes("exceeded")) {
        console.log("error type is MaxBookItemThresholdExceeded");
      }
    },
  });

  useEffect(() => {
    if (!cartItems || cartItems?.length === 0) return;
    if (hasCheckedOut.current) return;
    addCartItemsMutation(cartItems);
    hasCheckedOut.current = true;
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
      (item) => item.status === TransactionItemStatusEnum.CHECKOUT_SUCCESS
    );
    if (isAllBookProcessed && completedBooks.length === cartItems.length) {
      clearAllData();
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
