"use server";
import { cartServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";
import { BookLoan } from "@/core/domain/loan.model";
import { verifyToken } from "@/lib/jwt-parser";
import { cookies } from "next/headers";

export const checkout = async (cartItems: CartItemDto[]): Promise<BookLoan> => {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get(process.env.AUTH_COOKIE!);
    const payload = verifyToken(authCookie?.value!);
    const currentUserId = payload.sub as string;
    const userId = {
      value: currentUserId,
    };
    console.log('checking out.......' + currentUserId)
    return await cartServiceFacade.checkout({ userId, items: cartItems });
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};
