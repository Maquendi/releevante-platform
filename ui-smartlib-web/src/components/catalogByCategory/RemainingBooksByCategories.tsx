"use client";

import { useMemo } from "react";
import CatalogSliderItem from "./CatalogSliderItem";
import useFilterBooksByCategory from "@/hooks/useFilterBooksByCategory";


interface RemainingBooksByCategoriesPros {
    subCategoryId: string;
    categoryId:string;
}


export default function RemainingBooksByCategories({
    subCategoryId,
    categoryId
}:RemainingBooksByCategoriesPros) {
  const booksByCategory=useFilterBooksByCategory({categoryId})

  const remainingCategories = useMemo(() => {
    return booksByCategory?.filter(
      (item) => item.subCategory.id !== subCategoryId
    ) || []
  }, [booksByCategory, subCategoryId]);


  return <div className="space-y-5">
    {remainingCategories.map(item=>(
        <CatalogSliderItem key={item?.subCategory.id} {...item}/>
    ))}
  </div>;
}
