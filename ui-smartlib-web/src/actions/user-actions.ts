'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

const AUTH_COOKIE = process.env.AUTH_COOKIE as string;

// a server action.
export default async function doLogin(formData: FormData) {
    const userpin = formData.get('userpin') as string;

   // pages ->  facades -> services -> lib
    cookies().set(AUTH_COOKIE, userpin, {
        httpOnly: true,
        secure: true,
        //expires: session.expiresAt,
        sameSite: 'lax',
        path: '/',
      });
      return getLocale().then(locale => {
        redirect(`/${locale}/book-detail`);
      })
}