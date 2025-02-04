"use client";
import {
  FetchAllBookCategories,
  FetchAllBooksByOrg,
} from "@/actions/book-actions";
import { Book, Category, SubCategory, SubCategoryRelation } from "@/types/book";
import { useQuery } from "@tanstack/react-query";

interface SubCategoryBooks{
  books:Book[],
  subCategory:SubCategory
}

interface SelectedCategoryBooks extends SubCategoryBooks{
 category:Category
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

  const subCategoryBooksFrom = ({
    id,
    bookRelations,
  }: SubCategoryRelation): SubCategoryBooks => {
    const subCategoryBooks: Book[] = bookRelations?.map(
      (isbn) => books?.[isbn]
    );
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
    const currentCategory = categoriesData?.categories
      ?.find((item) => item.id === categoryId)
      ?.subCategoryRelations?.find((item) => item.id === subCategoryId);

    const selectedCategory=categoriesData?.categories?.find(item=>item.id === categoryId)
    const selected = selectedCategory? subCategoryBooksFrom(currentCategory!):null as any


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
