"use server";
import { cookies } from "next/headers";
import { userServiceFacade } from "@/identity/application";

export const authSignIn = async (passcode: string) => {
  const cookieStore = await cookies();
  try {
    const { token } = await userServiceFacade.authenticate({ value: passcode });

    cookieStore.set({
      name: process.env.AUTH_COOKIE!,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    throw new Error("Error signing in: " + error);
  }
};
