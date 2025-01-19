'use client'

import {
  LibraryInventory,
  SubCategoryGraph,
  PartialBook,
} from "@/book/domain/models";
import { arrayGroupinBy } from "@/lib/utils";

export default async function useFilterLibraryInventory(
  categoryId: string,
  libraryInventory?: LibraryInventory
) {
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
      categories,
      subCategories,
    };
  } else {
    const subCategories = categories?.find((category) => category.id == categoryId)
        ?.subCategories || [];

    return {
      categories,
      subCategories,
    };
  }
}
