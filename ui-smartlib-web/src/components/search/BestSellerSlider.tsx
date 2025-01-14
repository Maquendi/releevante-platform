'use client'
import React, { useMemo } from 'react'
import CatalogSliderItem from '../catalogByCategory/CatalogSliderItem';
import useFilterBooksByCategory from '@/hooks/useFilterBooksByCategory';

export default function BestSellerSlider() {
  
   const {booksByCategory} =useFilterBooksByCategory({})
  
    const bestSeller = useMemo(() => {
      return booksByCategory?.find(
        (item) =>
          item.subCategory?.enName?.toLocaleLowerCase() === "best sellers"
      );
    }, [booksByCategory]);

  
  return (
    <div className="border border-t border-b rounded-2xl border-gray-200">
    {bestSeller && (<CatalogSliderItem searchParams={{subCategoryId:bestSeller?.subCategory?.id}} {...bestSeller!} />)}
</div>  )
}
