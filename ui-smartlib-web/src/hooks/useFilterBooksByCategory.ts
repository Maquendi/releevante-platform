'use client'

import { FetchAllBookByCategory, LoanLibraryInventory } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface FilterBooksByCategryProps{
  categoryId:string
}
export default function useFilterBooksByCategory({categoryId}:FilterBooksByCategryProps) {

    const { data: categoryBooks } = useQuery({
        queryKey: ["BOOKS_BY_CATEGORIES"],
        queryFn: () => LoanLibraryInventory(),
      });
      if (!categoryId) {
        return categoryBooks; 
      }
    
      const filteredBooks: { [key: string]: any } = {};
    
      categoryBooks?.forEach(({ subCategory, books: bookList }) => {
        const isCategoryMatch = subCategory.id === categoryId;
    
        if (isCategoryMatch) {
          const subCategoryId = subCategory.id;
          if (!filteredBooks[subCategoryId]) {
            filteredBooks[subCategoryId] = {
              subCategory,
              books: [],
            };
          }
    
          filteredBooks[subCategoryId].books.push(...bookList);
        }
      });
    
      const BooksByCategory= Object.values(filteredBooks);

  return ({
    BooksByCategory
  }
  )
}
