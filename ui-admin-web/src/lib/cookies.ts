
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
type CookieOptions = {
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
};

export const setCookie = async (
  cookieName: string,
  value: string,
  options: CookieOptions = {}
) => {
  cookies().set(cookieName, value, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", 
    maxAge: 60 * 60 * 24, 
    ...options, 
  });
};



export const getCookie =(cookieName:string):RequestCookie | null=>{
  const cookieStore = cookies()
  if(cookieStore.has(cookieName)){
    return cookieStore.get(cookieName)!
  }
  return null
}