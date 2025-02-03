import {
  FetchAllBookCategories,
  FetchAllBooksByOrg,
} from "@/actions/book-actions";
import HeaderBanner from "@/components/catalogByCategory/HeaderBanner";
import RemainingBooksByCategories from "@/components/catalogByCategory/RemainingBooksByCategories";
import SeeAllBooks from "@/components/catalogByCategory/SeeAllBooks";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import MaxWithWrapper from "@/components/MaxWithWrapper";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { Suspense } from "react";

export default async function CatalogByCategoryPage({
  params,
  searchParams,
}: {
  params: Record<string, any>;
  searchParams: Record<string, any>;
}) {
  const categoryId = params?.categoryId?.length
    ? params.categoryId[0] !== "n"
      ? params.categoryId[0]
      : null
    : null;
  const subCategoryId = searchParams?.subCategoryId;
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.ensureQueryData({
      queryKey: ["LIBRARY_INVENTORY"],
      queryFn: FetchAllBooksByOrg,
    }),
    queryClient.ensureQueryData({
      queryKey: ["BOOK_CATEGORIES"],
      queryFn: FetchAllBookCategories,
    }),
  ]);
  return (
    <div className=" space-y-5 mb-5">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HeaderBanner categoryId={categoryId} subCategoryId={subCategoryId} />
        <MaxWithWrapper>
          <section className="mt-5 space-y-6">
            <SeeAllBooks
              categoryId={categoryId}
              subCategoryId={subCategoryId}
            />
            <HelpFindBookBanner />
            <Suspense>
              <RemainingBooksByCategories
                subCategoryId={subCategoryId}
                categoryId={categoryId}
              />
            </Suspense>
          </section>
        </MaxWithWrapper>
      </HydrationBoundary>
    </div>
  );
}
