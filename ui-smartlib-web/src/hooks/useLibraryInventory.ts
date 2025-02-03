"use client";
import { loadLibraryInventory } from "@/actions/book-actions";
import { SubCategory, Category } from "@/book/domain/models";
import { useQuery } from "@tanstack/react-query";

export default function useLibraryInventory() {
  const { data: libraryInventory, isPending } = useQuery({
    queryKey: ["BOOK_INVENTORY", "All"],
    queryFn: async () => await loadLibraryInventory(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const subCategoryFrom = ({ id, bookRelations }): SubCategory => {
    const subCategory: any = { ...libraryInventory!.subCategoryMap[id] };
    subCategory.books = bookRelations.map(
      (isbn) => libraryInventory!.books[isbn]
    );
    return subCategory;
  };

  const filterBySubCategory = (
    categoryId: string,
    subCategoryId: string
  ): { selected: Category; remaining: Category } => {
    let selected: Category = undefined!;
    let remaining: Category = undefined!;

    libraryInventory?.categories.forEach((category) => {
      const { subCategoryRelations, ...rest } = category;

      if (category.id === categoryId) {
        selected = { ...rest, subCategories: [] };
        const subCategoryRel = category.subCategoryRelations.find(
          (sub) => sub.id === subCategoryId
        );
        const subCategory: SubCategory = {
          ...libraryInventory?.subCategoryMap[subCategoryRel?.id!],
          books: [],
        };
        const books =
          subCategoryRel?.bookRelations.map(
            (isbn) => libraryInventory!.books[isbn]
          ) || [];
        subCategory.books = books;

        selected.subCategories = [subCategory];

        remaining = { ...rest, subCategories: [] };

        category.subCategoryRelations
          .filter((sub) => sub.id !== subCategoryId)
          .forEach((subCategoryRel) => {
            const subCategory: SubCategory = {
              ...libraryInventory!.subCategoryMap[subCategoryRel!.id],
              books: [],
            };
            const books =
              subCategoryRel?.bookRelations.map(
                (isbn) => libraryInventory!.books[isbn]
              ) || [];
            subCategory.books = books;
            remaining.subCategories.push(subCategory);
          });
      }
    });

    return {
      selected,
      remaining,
    };
  };

  return {
    isPending,
    subCategoryFrom,
    libraryInventory,
    filterBySubCategory,
  };
}
