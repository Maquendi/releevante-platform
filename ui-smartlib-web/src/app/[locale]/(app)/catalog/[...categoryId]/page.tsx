import HeaderBanner from "@/components/catalogByCategory/HeaderBanner";
import RemainingBooksByCategories from "@/components/catalogByCategory/RemainingBooksByCategories";
import SeeAllBooks from "@/components/catalogByCategory/SeeAllBooks";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import React, { Suspense } from "react";

export default function Page({ params, searchParams }) {
  const categoryId = params?.categoryId?.length
    ? params.categoryId[0] !== "n"
      ? params.categoryId[0]
      : null
    : null;
  const subCategoryId = searchParams?.subCategoryId;
  return (
    <div className=" space-y-5 mb-5">
      <HeaderBanner categoryId={categoryId} subCategoryId={subCategoryId} />
      <section className="px-5 mt-5 space-y-6">
        <SeeAllBooks categoryId={categoryId} subCategoryId={subCategoryId} />
        <HelpFindBookBanner />
        <Suspense>
          <RemainingBooksByCategories
            categoryId={categoryId}
            subCategoryId={subCategoryId}
          />
        </Suspense>
      </section>
    </div>
  );
}
