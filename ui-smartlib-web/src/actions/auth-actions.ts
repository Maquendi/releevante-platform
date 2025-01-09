"use server";
import { cookies } from "next/headers";
import { userServiceFacade } from "@/identity/application";
import { extractPayload } from "@/lib/jwt-parser";

export async function getAuthToken() {
  const cookieStore =await cookies();

  const authCookie = cookieStore.get(process.env.AUTH_COOKIE!);
  if(!authCookie?.value)return {
    userId:null,
    payload:null
  }
  const payload = extractPayload(authCookie!.value!);
  const userId = {
    value: payload.sub,
  };
  return {
    userId,
    payload
  }
}


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

export const authSignOut = async () => {
  try {
    (await cookies()).delete(process.env.AUTH_COOKIE!);
  } catch (error) {
    throw new Error("Error signing out: " + error);
  }
};
