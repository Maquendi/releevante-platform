"use server";
import { cartServiceFacade } from "@/core/application";
import { CartItemDto } from "@/core/application/dto";
import { BookLoan } from "@/core/domain/loan.model";
import { extractPayload } from "@/lib/jwt-parser";
import { cookies } from 'next/headers'
import { getAuthToken } from "./auth-actions";

export const checkout = async (cartItems: CartItemDto[]): Promise<BookLoan> => {
 
  try {
    const {userId}= await getAuthToken()
    return await cartServiceFacade.checkout({ userId:userId!, items: cartItems });
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};

export const FetchUserBooksLoan = async () => {
  try {
    const {userId}= await getAuthToken()
    return await cartServiceFacade.getUserLoanBooks(userId!)
  } catch (error) {
    console.log("error checkout" + error);
    throw new Error("error checkout" + error);
  }
};

