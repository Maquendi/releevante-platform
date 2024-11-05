import {  BookCopySchema } from "@/config/drizzle/schemas";


export interface SearchCriteria {
   filter:Partial<BookCopySchema>,
   limit?:number
  }