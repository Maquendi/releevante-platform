'use client'
import BookItem from "./BookItem";
import MaxWithWrapper from "../MaxWithWrapper";
import useLibraryInventory from "@/hooks/useLibraryInventory";
import { useTranslations } from "next-intl";

interface SeeAllBooksPros {
  subCategoryId: string;
  categoryId: string;
}

export default  function SeeAllBooks({
  subCategoryId,
  categoryId,
}: SeeAllBooksPros) {
  const t= useTranslations('SeeAllPage')
 
  const {filterBySubCategory}=useLibraryInventory()
  const {selected} = filterBySubCategory(categoryId,subCategoryId)
  

  return (
   <MaxWithWrapper>
     <div className="min-h-[250px]">
      <h2 className="text-xl font-medium space-x-2 mb-5">
        <span className=" capitalize">{t('books')}</span>
        <span className="text-secondary-foreground font-light">
          ({selected?.books?.length || 0})
        </span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] place-items-center md:place-items-start  gap-2 md:gap-5">
        {selected?.books?.map((book: any) => (
          <BookItem
            className="text-xs"
            key={book.isbn}
            width={140}
            height={180}
            book={book}
          />
        ))}
      </div>
    </div>
   </MaxWithWrapper>
  );
}
