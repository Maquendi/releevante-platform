'use server'

import { cookies } from "next/headers";


export const authSignIn = async (passcode: string) => {
    const cookieStore = await cookies();
  
    try {
  
      cookieStore.set({
        name: process.env.AUTH_COOKIE!,
        value: passcode,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 10,
      })
      return passcode
  
    } catch (error) {
      throw new Error("Error signing in: " + error);
    }
  };


  export async function authSignOut(){
    return true
  }
