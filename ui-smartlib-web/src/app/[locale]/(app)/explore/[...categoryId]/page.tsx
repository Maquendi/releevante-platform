import SeeAllBookComponent from "@/components/explore/seeall/SeeAllBookComponent";
import React from "react";

export default async function Page({ params, searchParams }) {

  const categoryId = params.categoryId[0];
  const subCategoryId = searchParams?.subCategoryId;
  return (
      <SeeAllBookComponent
        categoryId={categoryId}
        subCategoryId={subCategoryId}
      />
  );
}
