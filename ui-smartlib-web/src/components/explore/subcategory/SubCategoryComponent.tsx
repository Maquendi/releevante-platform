"use client";
import { SubCategoryGraph } from "@/book/domain/models";
import React from "react";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { CatalogSliderSkeleton } from "../../CatalogSlider";

const SubCategorySlider = dynamic(() => import("./Slider"), {
  loading: () => <CatalogSliderSkeleton />,
});

export default function SubCategoryComponent({
  books,
  ...rest
}: SubCategoryGraph) {
  const locale = useLocale();
  return (
    <div
      key={rest?.id}
      className="relative bg-[#FFFFFF] space-y-6 pt-6 pb-7 px-2  rounded-xl"
    >
      <div className=" h-[44px] flex items-center ">
        <h4 className="text-xl font-medium  space-x-2 pl-2">
          <span>{rest?.[`${locale}`]}</span>
          <span className="font-light text-secondary-foreground">
            ({books?.length})
          </span>
        </h4>
      </div>
      <SubCategorySlider books={books} subCategoryId={rest.id} />
    </div>
  );
}
