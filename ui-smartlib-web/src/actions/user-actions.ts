"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { identityService } from "@/domain/identity/facade";
import { cookies } from "next/headers";

const AUTH_COOKIE = process.env.AUTH_COOKIE as string;

// a server action.
export default async function doLogin(formData: FormData) {
  try {
    const passcode = formData.get("passcode") as string;

    const { token } = await identityService.doLogin(passcode);

    cookies().set(AUTH_COOKIE, token, {
      httpOnly: true,
    });

    return getLocale().then((locale) => {
      redirect(`/${locale}/user-playgound`);
    });
  } catch (error: any) {
    throw new Error("Error signin in" + error);
  }
}
