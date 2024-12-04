'use server'

import { dbGetOne } from "@/lib/db/drizzle-client"

export interface LibrarySettings {
    id: string;
    maxBooksPerLoan: string;
    bookPriceDiscountPercentage: string;
    bookPriceSurchargePercentage: string;
    bookPriceReductionThreshold: string;
    bookPriceReductionRateOnThresholdReached: string;
  }
  

export default async function FetchLibrarySettings():Promise<LibrarySettings> {
  try {
    return await dbGetOne("librarySettingsSchema")
  } catch (error) {
   throw new Error('Faild to load configuration') 
  }
}
