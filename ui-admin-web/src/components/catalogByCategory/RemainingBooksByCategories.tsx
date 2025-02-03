'use client'
import useLibraryInventory from "@/hooks/useLibraryInventory";
import CatalogSliderItem from "./CatalogSliderItem";

interface RemainingBooksByCategoriesPros {
  subCategoryId: string;
  categoryId:string
}

export default  function RemainingBooksByCategories({
  subCategoryId,
  categoryId
}: RemainingBooksByCategoriesPros) {

   const {filterBySubCategory}=useLibraryInventory()
    const {remaining} = filterBySubCategory(categoryId,subCategoryId)


  return (
     <div className="space-y-5">
      {remaining?.map(({books,subCategory},index) => (
        <CatalogSliderItem key={index} categoryId={categoryId} books={books} subCategory={subCategory} />
      ))}
    </div>
  );
}
