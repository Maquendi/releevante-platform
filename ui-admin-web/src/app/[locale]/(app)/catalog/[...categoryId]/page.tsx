import HeaderBanner from "@/components/catalogByCategory/HeaderBanner";
import RemainingBooksByCategories from "@/components/catalogByCategory/RemainingBooksByCategories";
import SeeAllBooks from "@/components/catalogByCategory/SeeAllBooks";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import React, { Suspense } from "react";


export default function CatalogByCategoryPage({ params, searchParams }:{params:Record<string,any>,searchParams:Record<string,any>}) {
  const categoryId = params?.categoryId?.length
    ? params.categoryId[0] !== "n"
      ? params.categoryId[0]
      : null
    : null;
  const subCategoryId = searchParams?.subCategoryId;
  return (
    <div className=" space-y-5 mb-5">
      <HeaderBanner categoryId={categoryId} subCategoryId={subCategoryId} />
      <section className="px-2 mt-5 space-y-6">
        <SeeAllBooks categoryId={categoryId} subCategoryId={subCategoryId} />
        <HelpFindBookBanner />
        <Suspense>
          <RemainingBooksByCategories
            subCategoryId={subCategoryId}
          />
        </Suspense>
      </section>
    </div>
  );
}
