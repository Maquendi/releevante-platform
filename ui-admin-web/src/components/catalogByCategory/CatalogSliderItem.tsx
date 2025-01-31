'use client'
import { useLocale } from "next-intl";
import dynamic from 'next/dynamic'
import { CatalogSliderSkeleton } from "../CatalogSlider";
import { Book, SubCategory } from "@/types/book";
import { Locales } from "@/types/globals";

const CatalogSlider = dynamic(() => import("@/components/CatalogSlider"), {
  loading: () => <CatalogSliderSkeleton/>,
})
 
interface CatalogSliderItemProps{
  categoryId:string,
  subCategory:SubCategory,
  books:Book[]
}

export default  function CatalogSliderItem({
  categoryId,
  subCategory,
  books,
}: CatalogSliderItemProps) {
  const locale=useLocale()


  return (
    <div
      key={subCategory?.id}
      className="relative bg-[#FFFFFF] space-y-6 pt-6 pb-7 px-2  rounded-xl"
    >
      <div className=" h-[44px] flex items-center ">
        <h4 className="text-xl font-medium  space-x-2 pl-2">
          <span>{subCategory?.[`${locale}` as Locales]}</span>
          <span className="font-light text-secondary-foreground">
            ({books?.length})
          </span>
        </h4>
      </div>
      <div>
        <CatalogSlider categoryId={categoryId} subCategoryId={subCategory?.id} books={books} />
      </div>
    </div>
  );
}
