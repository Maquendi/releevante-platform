"use server";
import { cartServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";
import { cookies } from "next/headers";

export const addItemToCart = async () => {
  const cookieStore = await cookies();
  try {
    const cartIdCookie = cookieStore.get("CART_ID");
    if (cartIdCookie) return { cart_id: cartIdCookie.value };

    const currentUser = {
      value: "451547885-14584722-45878452",
    };

    const cartId = await cartServiceFacade.initCart(currentUser);
    cookieStore.set("CART_ID", cartId.value);
    return true
  } catch (error) {
    console.log("error new cart action" + error);
    throw new Error("Creating cart id " + error);
  }
};

export const checkout = async (cartItems: CartItemDto[]): Promise<any> => {
  try {

    const userId = {
      value: "451547885-14584722-45878452",
    };

    await cartServiceFacade.checkout({userId, items: cartItems });
    return;
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};
