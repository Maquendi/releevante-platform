"use client";

import { FetchAllBookByCategory } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import CatalogSliderItem from "./CatalogSliderItem";


interface RemainingBooksByCategoriesPros {
    subCategoryId: string;
    categoryId:string;
}


export default function RemainingBooksByCategories({
    subCategoryId,
    categoryId
}:RemainingBooksByCategoriesPros) {
  const { data: categoryBooks } = useQuery({
    queryKey: ["BOOKS_BY_CATEGORIES",categoryId],
    queryFn: () => FetchAllBookByCategory(categoryId),
  });

  const remainingCategories = useMemo(() => {
    return categoryBooks?.filter(
      (item) => item.subCategory.id !== subCategoryId
    ) || []
  }, [categoryBooks, subCategoryId]);


  return <div className="space-y-5">
    {remainingCategories.map(item=>(
        <CatalogSliderItem key={item.category.id} {...item}/>
    ))}
  </div>;
}
