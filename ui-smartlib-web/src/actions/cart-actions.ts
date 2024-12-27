"use server";
import { cartServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";
import { BookLoan } from "@/core/domain/loan.model";
import { extractPayload } from "@/lib/jwt-parser";
import { cookies } from 'next/headers'

export const checkout = async (cartItems: CartItemDto[]): Promise<BookLoan> => {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(process.env.AUTH_COOKIE!)

  try {
    const payload = extractPayload(authCookie!.value!)

    const userId = {
      value: payload.sub,
    };
    return await cartServiceFacade.checkout({ userId, items: cartItems });
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};

export const FetchUserBooksLoan = async () => {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(process.env.AUTH_COOKIE!)

  try {
    const payload = extractPayload(authCookie!.value!)

    const userId = {
      value: payload.sub,
    };
    return await cartServiceFacade.getUserLoanBooks(userId)
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};

