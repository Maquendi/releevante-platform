import MaxWithWrapper from "../MaxWithWrapper";
import CatalogSliderItem from "./CatalogSliderItem";
import { FetchBookByCategory } from "@/actions/book-actions";

interface RemainingBooksByCategoriesPros {
  subCategoryId: string;
}

export default async function RemainingBooksByCategories({
  subCategoryId,
}: RemainingBooksByCategoriesPros) {
  const booksByCategory = await FetchBookByCategory();

  const remainingCategories =
    booksByCategory?.filter((item) => item.subCategory.id !== subCategoryId) ||
    [];

  return (
   <MaxWithWrapper>
     <div className="space-y-5">
      {remainingCategories.map((item) => (
        <CatalogSliderItem key={item?.subCategory.id} {...item} />
      ))}
    </div>
   </MaxWithWrapper>
  );
}
