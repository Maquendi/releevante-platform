"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { loadBooksBySubcategory } from "@/actions/book-actions";
import dynamic from "next/dynamic";
import { CatalogSliderSkeleton } from "../CatalogSlider";

const SubCategoryComponent = dynamic(
  () => import("../explore/subcategory/SubCategoryComponent"),
  {
    loading: () => <CatalogSliderSkeleton />,
  }
);

export default function BestSellerSlider() {
  const { data: bestSeller } = useQuery({
    queryKey: ["BEST_SELLER_SUB_CATEGORY"],
    queryFn: async () => await loadBooksBySubcategory("Bestsellers"),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="border border-t border-b rounded-2xl border-gray-200">
      {bestSeller && (
        <SubCategoryComponent categoryId="All" subCategory={bestSeller} />
      )}
    </div>
  );
}
