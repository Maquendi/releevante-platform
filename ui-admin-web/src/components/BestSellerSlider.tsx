"use client";
import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { CatalogSliderSkeleton } from "./CatalogSlider";
import {
  FetchAllBookCategories,
  FetchBooksByTag,
} from "@/actions/book-actions";

const CatalogSliderItem = dynamic(
  () => import("./catalogByCategory/CatalogSliderItem"),
  {
    loading: () => <CatalogSliderSkeleton />,
  }
);

export default function BestSellerSlider() {
  const { data: bestSellerBooks } = useSuspenseQuery({
    queryKey: ["BEST_SELLER_SUB_CATEGORY"],
    queryFn: async () => await FetchBooksByTag("Bestsellers"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["BOOK_CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const bestSellersSubCat = Object.values(
    categoriesData?.subCategoryMap || {}
  )?.find((item) => item?.en.toLocaleLowerCase() === "bestsellers");
  return (
    <div className="border border-t border-b rounded-2xl border-gray-200">
      {bestSellerBooks && (
        <CatalogSliderItem
          categoryId="All"
          subCategory={bestSellersSubCat!}
          books={bestSellerBooks}
        />
      )}
    </div>
  );
}
