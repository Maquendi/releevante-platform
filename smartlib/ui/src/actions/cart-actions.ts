"use server";
import { bookTransactionServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";
import { BookTransactions } from "@/core/domain/loan.model";
import { getAuthToken } from "./auth-actions";

export const checkout = async (
  cartItems: CartItemDto[]
): Promise<BookTransactions> => {
  const { userId } = await getAuthToken();

  if (userId) {
    return await bookTransactionServiceFacade.checkout({
      userId: userId!,
      items: cartItems,
    });
  }

  throw new Error("Unauthorized");
};
