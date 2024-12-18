import {
  FetchAllBookCategories,
  LoanLibraryInventory,
} from "@/actions/book-actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";

const CatalogList = lazy(()=>import("@/components/catalog/CatalogPage"))
import { lazy, Suspense } from "react";

export default async function CatalogPage({ searchParams }) {
  const queryClient = new QueryClient();
  await queryClient.ensureQueryData({
    queryKey: ["BOOKS_BY_CATEGORIES"],
    queryFn: async() => await LoanLibraryInventory(),
  });
  await queryClient.ensureQueryData({
    queryKey: ["CATEGORIES"],
    queryFn: async() =>await FetchAllBookCategories(),
  });
  const selectedCategory = searchParams?.categoryId;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
      <CatalogList categoryId={selectedCategory} />
      </Suspense>
    </HydrationBoundary>
  );
}
