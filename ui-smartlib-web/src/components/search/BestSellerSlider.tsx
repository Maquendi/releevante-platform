"use client";
import React, { useMemo } from "react";
import CatalogSliderItem from "../catalogByCategory/CatalogSliderItem";
import useFilterBooksByCategory from "@/hooks/useFilterBooksByCategory";
import { useQuery } from "@tanstack/react-query";
import { loadBooksBySubcategory, loadLibraryInventory } from "@/actions/book-actions";
import dynamic from "next/dynamic";
import { CatalogSliderSkeleton } from "../CatalogSlider";
import SubCategoryComponent from "../explore/subcategory/SubCategoryComponent";

const SubCategorySlider = dynamic(
  () => import("../explore/subcategory/Slider"),
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
      {bestSeller && <SubCategoryComponent {...bestSeller!} />}
    </div>
  );
}
