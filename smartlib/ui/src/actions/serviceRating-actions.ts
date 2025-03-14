'use server'
import { serviceRatingFacade } from "@/core/application";
import { extractPayload } from "@/lib/jwt-parser";
import { cookies } from "next/headers";
import { getAuthToken } from "./auth-actions";

export interface ServiceRatingAction {
    rating: number;
    comment?: string;
  }
  

export async function SaveBookReview(review: ServiceRatingAction) {
 
  
    try {
    const {userId}= await getAuthToken()

      return await serviceRatingFacade.saveServiceReview({
        ...review,
        clientId: userId?.value!,
      });
    } catch (error) {
      throw new Error("error saving book review" + error);
    }
  }