'use client'
import { FetchAllBookByCategory } from '@/actions/book-actions';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'
import CatalogSliderItem from '../catalogByCategory/CatalogSliderItem';
import useFilterBooksByCategory from '@/hooks/useFilterBooksByCategory';

export default function BestSellerSlider() {
  
   const categoryBooks =useFilterBooksByCategory({})
  
    const bestSeller = useMemo(() => {
      return categoryBooks?.find(
        (item) =>
          item.subCategory?.enName?.toLocaleLowerCase() === "best sellers"
      );
    }, [categoryBooks]);

  
  return (
    <div className="border border-t border-b rounded-2xl border-gray-200">
    {bestSeller && (<CatalogSliderItem {...bestSeller!} />)}
</div>  )
}
