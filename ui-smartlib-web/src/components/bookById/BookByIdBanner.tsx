"use client";
import React, { useEffect, useState } from "react";
import Rating from "../Rating";
import { Book } from "@/book/domain/models";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import useSyncImagesIndexDb from "@/hooks/useImagesIndexDb";
import ImageWithSkeleton from "../ImageWithSkeleton";
import { useAppSelector } from "@/redux/hooks";
const SelectLanguage = dynamic(() => import("./SelectLanguage"), {
  ssr: false,
});

interface BookByIdBannerProps {
  book: Book;
}
export default function BookByIdBanner({ book }: BookByIdBannerProps) {
  const locale = useLocale();
  const t = useTranslations("bookById");
  const { getImageByBookId } = useSyncImagesIndexDb();
  const selectedLanguage = useAppSelector((state) => state.cart.language);
  const [image,setImage]=useState<string | null>(null)

  useEffect(()=>{
    if(!book?.id)return
    getImageByBookId({id:book?.id,image:book.image})
    .then(image=>setImage(image))
  },[book])

  
  return (
    <div className="flex gap-5 p-3 rounded-md m-auto bg-white px-5 py-10">
      <div>
        <ImageWithSkeleton
          className="rounded-xl object-cover"
          src={image || book?.image}
          width={250}
          height={300}
          alt="image book"
        />
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex gap-2 mb-5">
          {book?.categories?.map((category) => (
            <p
              key={category?.enTagValue}
              className="bg-primary py-1 px-2 rounded-sm text-white text-sm font-medium"
            >
              <span>{category?.[`${locale}TagValue`]}</span>
            </p>
          ))}
      
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
        <div className="flex gap-2 text-sm rounded-md border border-primary bg-[#FAF9F9] w-fit py-0.5 px-2">
          <p className=" space-x-2 font-semibold">Available</p>
          <p className="space-x-1 text-gray-700">
            <span className="">New</span>
            <span>({book?.condition?.[selectedLanguage!]?.new || 0})</span>
          </p>
          <p>|</p>
          <p className="space-x-1 text-gray-700">
            <span>Used</span>
            <span>({book?.condition?.[selectedLanguage!]?.used || 0})</span>
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
