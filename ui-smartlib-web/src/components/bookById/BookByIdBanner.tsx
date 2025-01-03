'use client'
import React, { useEffect, useState } from "react";
import Rating from "../Rating";
import Image from "next/image";
import { Book } from "@/book/domain/models";
import { useLocale, useTranslations } from "next-intl";
import dynamic from 'next/dynamic'
import useSyncImagesIndexDb from "@/hooks/useSyncImagesIndexDb";
import ImageWithSkeleton from "../ImageWithSkeleton";
const SelectLanguage = dynamic(() => import( "./SelectLanguage"), {
  ssr:false
})
 
interface BookByIdBannerProps {
  book: Book;
}
export default function BookByIdBanner({ book }: BookByIdBannerProps) {
  const locale = useLocale();
  const t = useTranslations("bookById");
  const [bookImage,setBookImage]=useState<string | null>(null)
  const {getImageByBookId}=useSyncImagesIndexDb()
  useEffect(()=>{
    getImageByBookId(book.id)
    .then((image)=>{
      if(!image)return
      setBookImage(image as string)
    })
  },[book])


  return (
    <div className="flex gap-5 p-3 rounded-md m-auto bg-white px-5 py-10">
      <div>
       <ImageWithSkeleton className="rounded-xl object-cover" src={bookImage || ''} width={250} height={300} alt="image book"/>
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex gap-2 mb-5">
          {book?.categories.map(category=>(
             <p key={category.enTagValue} className="bg-primary py-1 px-2 rounded-sm text-white text-sm font-medium">
             <span>{category?.[`${locale}TagValue`]}</span>
           </p>
          ))}
          <p className="bg-secondary py-1 px-2 rounded-sm  text-sm font-medium">
            Semi-used
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-semibold">{book?.bookTitle}</h2>
          <p className="font-medium text-2xl text-secondary-foreground">
            {book?.author}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Rating rating={book?.rating || 0} />
          <p className="text-secondary-foreground text-sm">{book?.rating}</p>
          <p className="text-secondary-foreground text-sm">
            ({book?.votes} votes)
          </p>
        </div>
        <div className="border-t border-secondary pt-3">
          <h4 className="font-medium mb-1">{t("selectLanguage")}</h4>
          <SelectLanguage booklanguages={book?.languages} />
        </div>
      </div>
    </div>
  );
}
