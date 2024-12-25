'use server'
import { serviceRatingFacade } from "@/core/application";
import { extractPayload } from "@/lib/jwt-parser";
import { cookies } from "next/headers";

export interface ServiceRatingAction {
    rating: number;
    comment?: string;
  }
  

export async function SaveBookReview(review: ServiceRatingAction) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(process.env.AUTH_COOKIE!);
  
    try {
      const payload = extractPayload(authCookie!.value!);
  
      return await serviceRatingFacade.saveServiceReview({
        ...review,
        clientId: payload.sub,
      });
    } catch (error) {
      throw new Error("error saving book review" + error);
    }
  }