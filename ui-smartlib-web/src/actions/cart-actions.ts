"use server";
import { cartServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";

export const checkout = async (cartItems: CartItemDto[]): Promise<any> => {
  try {
    const userId = {
      value: "451547885-14584722-45878452",
    };

    await cartServiceFacade.checkout({ userId, items: cartItems });
    return;
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};
