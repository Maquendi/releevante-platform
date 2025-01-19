"use client";
import { loadLibraryInventory } from "@/actions/book-actions";
import {
  LibraryInventory,
  SubCategoryGraph,
  PartialBook,
  CategoryGraph,
} from "@/book/domain/models";
import { arrayGroupinBy } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function filterLibraryInventory(
  libraryInventory?: LibraryInventory,
  categoryId?: string
): CategoryGraph {
  const categories = libraryInventory?.categories;
  console.log(libraryInventory);
  if (!categoryId) {
    const subCategoriesDuplicated = libraryInventory?.categories.flatMap(
      (category) => category.subCategories
    );
    const subCategoriesGrouped = arrayGroupinBy(subCategoriesDuplicated!, "id");
    const subCategories = Object.keys(subCategoriesGrouped).map((key) => {
      const subCategories: SubCategoryGraph[] = subCategoriesGrouped[key];
      const first = subCategories[0];
      const myMap = new Map<string, PartialBook>();
      subCategories
        .flatMap((item) => item.books)
        .forEach((item) => {
          myMap.set(item.isbn, item);
        });
      first.books = Array.from(myMap.values());
      return first;
    });
    return {
      en: "All",
      fr: "Tout",
      es: "Todo",
      id: undefined!,
      subCategories,
    };
  } else {
    const category = libraryInventory?.categories.find(
      (category) => category.id == categoryId
    );

    return category!;
  }
}

export default function useLibraryInventory() {
  const { data: libraryInventory, isPending } = useQuery({
    queryKey: ["CATEGORY_GRAPH", "All"],
    queryFn: async () => await loadLibraryInventory(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const useFilterLibraryInventoryByCategory = (
    categoryId?: string
  ): CategoryGraph => {
    const { data: inventoryFilteredByCategory } = useQuery({
      queryKey: ["INVENTORY_BY_CATEGORY", categoryId],
      queryFn: async () =>
        filterLibraryInventory(libraryInventory, categoryId!),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

    return inventoryFilteredByCategory!;
  };

  const useFilterLibraryInventoryBySubCategory = (
    categoryId: string,
    subCategoryId: string
  ): CategoryGraph => {
    const inventoryFilteredByCategory =
      useFilterLibraryInventoryByCategory(categoryId);
    const subCategory =
      inventoryFilteredByCategory?.subCategories.find(
        (item) => item.id == subCategoryId
      ) || ([] as any);
    return {
      ...inventoryFilteredByCategory,
      subCategories: [subCategory],
    };
  };

  const shardCategoryGraph = (
    categoryId: string,
    subCategoryId: string
  ): { selected: CategoryGraph; remaining: CategoryGraph } => {
    const selectedCategory = Object.assign(
      {},
      useFilterLibraryInventoryByCategory(categoryId)
    );

    const remaining: SubCategoryGraph[] = [];
    let selectedSubCategory: SubCategoryGraph[] = [];
    selectedCategory?.subCategories?.forEach((subCategory) => {
      if (subCategory?.id == subCategoryId) {
        selectedSubCategory = [subCategory];
      } else {
        remaining.push(subCategory);
      }
    });

    const remainingCategory = {
      ...selectedCategory,
    };

    if (selectedCategory) {
      selectedCategory.subCategories = selectedSubCategory;

      remainingCategory.subCategories = remaining;
    }

    return {
      selected: selectedCategory,
      remaining: remainingCategory,
    };
  };

  return {
    isPending,
    shardCategoryGraph,
    useFilterLibraryInventoryByCategory,
    useFilterLibraryInventoryBySubCategory,
    libraryInventory,
  };
}
