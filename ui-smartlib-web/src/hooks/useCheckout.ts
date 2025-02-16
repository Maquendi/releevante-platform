import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "@/config/i18n/routing";
import { SocketEventType, useWebSocketServer } from "@/socket";
import { useMutation } from "@tanstack/react-query";
import { checkout } from "@/actions/cart-actions";
import { setTransaction } from "@/redux/features/bookExchangeSlice";

export function useCheckout() {
  const dispatch = useAppDispatch();
  const { eventEmitter } = useWebSocketServer(dispatch);

  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: checkout,
    retry: 1,
    onSuccess(data) {
      console.log("DATA onSuccess");
      dispatch(setTransaction(data));

      const payload = {};

      if (data.rent) {
        payload["rent"] = data.rent[0];
      }
      if (data.purchase) {
        payload["purchase"] = data.purchase[0];
      }

      eventEmitter(SocketEventType.checkout, { payload });
      router.push("/checkout");
    },
    onError(error) {
      console.log("error on checkout");
      console.log(error);
      if (error?.message?.includes("exceeded")) {
        console.log("error type is MaxBookItemThresholdExceeded");
      }
    },
  });

  const transactionCheckout = () => {
    return mutate(cartItems);
  };

  return {
    transactionCheckout,
    isPending,
    isError,
  };
}
