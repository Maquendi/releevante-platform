'use client'

import { FetchAllBookByCategory } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface FilterBooksByCategryProps{
    subCategoryId:string
}
export default function useFilterBooksByCategory({subCategoryId}:FilterBooksByCategryProps) {

    const { data: categoryBooks } = useQuery({
        queryKey: ["BOOKS_BY_CATEGORIES"],
        queryFn: () => FetchAllBookByCategory(''),
      });
    
      const bookByCategory = useMemo(() => {
        const data = categoryBooks?.filter(
          (item) => item.subCategory.id === subCategoryId
        );
        return data?.length ? data[0] : null;
      }, [categoryBooks, subCategoryId]);

  return ({
    bookByCategory
  }
  )
}
