"use server";
import { cartServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";
import { BookLoan } from "@/core/domain/loan.model";

export const checkout = async (cartItems: CartItemDto[]): Promise<BookLoan> => {
  try {
    const userId = {
      value: "451547885-14584722-45878452",
    };
    return await cartServiceFacade.checkout({ userId, items: cartItems });
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};
