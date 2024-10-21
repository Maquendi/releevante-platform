'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

const AUTH_COOKIE = process.env.AUTH_COOKIE as string;

// a server action.
export default async function doLogin(formData: FormData) {
    const userpin = formData.get('userpin') as string;
    cookies().set(AUTH_COOKIE, '123456789', {
        httpOnly: true,
        secure: true,
        //expires: session.expiresAt,
        sameSite: 'lax',
        path: '/',
      });
      return getLocale().then(locale => {
        redirect(`/${locale}`);
      })

   
}