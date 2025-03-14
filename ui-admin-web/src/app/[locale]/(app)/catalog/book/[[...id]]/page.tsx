import { FetchBookById, FetchBooksByTag } from "@/actions/book-actions";
import React, { lazy, Suspense } from "react";
import MaxWithWrapper from "@/components/MaxWithWrapper";
import BookDetails from "@/components/bookById/BookDetails";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";

const BestSellerSlider = lazy(()=>import("@/components/BestSellerSlider"))



export default async function BookDetailsPage({
  params,
  searchParams,
}: {
  params: Record<string, any>;
  searchParams: Record<string, any>;
}) {
  const isbn = params?.id?.length ? params.id[0] : undefined;
  const translationId = searchParams?.translationId;
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["BOOK_BY_ID", isbn],
    queryFn: async () => FetchBookById(isbn, translationId),
  });

  queryClient.prefetchQuery({
    queryKey: ["BEST_SELLER_SUB_CATEGORY"],
    queryFn: async () => FetchBooksByTag("Bestsellers"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MaxWithWrapper className="space-y-3 pb-5">
        <BookDetails isbn={isbn} translationId={translationId} />
        <Suspense>
          <BestSellerSlider />
        </Suspense>
      </MaxWithWrapper>
    </HydrationBoundary>
  );
}
