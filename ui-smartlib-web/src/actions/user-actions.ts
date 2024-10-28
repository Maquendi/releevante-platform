"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { userServiceFacade } from "@/identity/application/services.facade";

const AUTH_COOKIE = process.env.AUTH_COOKIE as string;

// a server action.
export default async function doLogin(formData: FormData) {
  try {
    const passcode = formData.get("passcode") as string;

    const { token } = await userServiceFacade.authenticate({
      value: passcode,
    });

    cookies().set(AUTH_COOKIE, token, {
      httpOnly: true,
    });

    return getLocale().then((locale) => {
      redirect(`/${locale}`);
    });
  } catch (error: any) {
    throw new Error("Error signin in" + error);
  }
}
