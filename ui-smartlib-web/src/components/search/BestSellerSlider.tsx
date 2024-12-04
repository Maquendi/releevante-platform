'use client'
import { FetchAllBookByCategory } from '@/actions/book-actions';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'
import CatalogSliderItem from '../catalogByCategory/CatalogSliderItem';

export default function BestSellerSlider() {
    const {data:categoryBooks} =useQuery({
        queryKey: ["BOOKS_BY_CATEGORIES",null],
        queryFn: () => FetchAllBookByCategory(""),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10,
      });
  
    const bestSeller = useMemo(() => {
      return categoryBooks?.find(
        (item) =>
          item.subCategory.enSubCategoryName.toLocaleLowerCase() === "best sellers"
      );
    }, [categoryBooks]);
  
  return (
    <div className="border border-t border-b rounded-2xl border-gray-200">
    {bestSeller && (<CatalogSliderItem {...bestSeller!} />)}
</div>  )
}
