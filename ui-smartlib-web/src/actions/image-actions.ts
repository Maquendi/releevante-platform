'use server'
import { books_images_schema } from "@/config/drizzle/schemas"
import { dbGetAll, dbPut } from "@/lib/drizzle-client"
import { eq } from "drizzle-orm"

export const getUnsincronizedImages=()=>{
    return  dbGetAll('books',{
        with:{
            images:{
                where:eq(books_images_schema.isSincronized,false)            }
        }
    })
}

export const setUnsincronizedImagesToTrue=(image_id:number)=>{
    return  dbPut('books_images_schema',image_id,{isSincronized:true})
}