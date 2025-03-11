"use client";
import {
  FetchAllBookCategories,
  FetchAllBooksByOrg,
} from "@/actions/book-actions";
import { Book, Category, SubCategory, SubCategoryRelation } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import useGetRecommendedBook from "./useGetRecommendationBook";
import { useSearchParams } from "next/navigation";

interface SubCategoryBooks{
  books:Book[],
  subCategory:SubCategory
}

interface SelectedCategoryBooks extends SubCategoryBooks{
 category:Category
}

const recomendationsTranslations = {
  en: 'Recommendations',
  es: 'Recomendaciones',
  fr: 'Recommandations'
}


export default function useLibraryInventory() {
  
  const { data: books} = useQuery({
    queryKey: ["LIBRARY_INVENTORY"],
    queryFn: async()=>FetchAllBooksByOrg(),
    refetchOnMount:false,
    refetchOnWindowFocus:false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["BOOK_CATEGORIES"],
    queryFn: async()=>FetchAllBookCategories(),
    refetchOnMount:false,
    refetchOnWindowFocus:false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5
  });


  const searchParams = useSearchParams()
  const paramsObject = Object.fromEntries(searchParams.entries());
  const {recomendations}=useGetRecommendedBook(paramsObject!)

  const subCategoryBooksFrom = (subCategoryRelation: SubCategoryRelation): SubCategoryBooks => {
    const {id,bookRelations}=subCategoryRelation || {}
    const subCategoryBooks: Book[] = bookRelations?.map(
      (isbn) => books?.[isbn as keyof Book]
    ) as any
    const subCategory = categoriesData?.subCategoryMap?.[id] 

    return {
      subCategory:subCategory!,
      books: subCategoryBooks,
    };
  };

  const filterBySubCategory = (
    categoryId: string,
    subCategoryId: string
  ): { selected: SelectedCategoryBooks; remaining: SubCategoryBooks[] } => {

    const currentSubCategory = categoriesData?.categories
      ?.find((item) => item.id === categoryId)
      ?.subCategoryRelations?.find((item) => item.id === subCategoryId);

    const selectedCategory=categoriesData?.categories?.find(item=>item.id === categoryId)
    const recomendationSelected= recomendations?.others ? {subCategory:recomendationsTranslations,books:recomendations?.others} : null
    const selected =recomendationSelected ? recomendationSelected: subCategoryBooksFrom(currentSubCategory!) 

    const remaining = categoriesData?.categories
    ?.find((item) => item.en.toLocaleLowerCase() === 'all')
    ?.subCategoryRelations.filter(item=>item.id !== subCategoryId)
    .map(item=>subCategoryBooksFrom(item)) 

    return {
      selected:{
        ...selected,
        category:selectedCategory!
      },
      remaining:remaining!,
    };
  };

  return {
    subCategoryBooksFrom,
    categories: categoriesData?.categories,
    subCategories: categoriesData?.subCategoryMap,
    filterBySubCategory,
  };
}
