'use client'
import {  BooksByCategory } from "@/book/domain/models";
import React, { lazy, Suspense } from "react";
import { useLocale } from "next-intl";
import dynamic from 'next/dynamic'
 
const CatalogSlider = dynamic(() => import("../CatalogSlider"), {
  loading: () => <p>Loading...</p>,
})
 

export default  function CatalogSliderItem({
  subCategory,
  books,
}: BooksByCategory) {
  const locale=useLocale()
  return (
    <div
      key={subCategory?.id}
      className="relative bg-[#FFFFFF] space-y-6 pt-6 pb-7 px-2  rounded-xl"
    >
      <div className=" h-[44px] flex items-center ">
        <h4 className="text-xl font-medium  space-x-2 pl-2">
          <span>{subCategory?.[`${locale}SubCategoryName`]}</span>
          <span className="font-light text-secondary-foreground">
            ({books?.length})
          </span>
        </h4>
      </div>
      <div>
        <CatalogSlider subCategoryId={subCategory?.id} books={books} />
      </div>
    </div>
  );
}
