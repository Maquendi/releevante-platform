"use server";
import { cartServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";
import { BookTransactions } from "@/core/domain/loan.model";
import { getAuthToken } from "./auth-actions";

export const checkout = async (
  cartItems: CartItemDto[]
): Promise<BookTransactions> => {
  try {
    const { userId } = await getAuthToken();
    return await cartServiceFacade.checkout({
      userId: userId!,
      items: cartItems,
    });
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};
