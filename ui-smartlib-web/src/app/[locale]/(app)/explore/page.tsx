import { loadLibraryInventory } from "@/actions/book-actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const ExploreComponent = lazy(
  () => import("@/components/explore/ExploreComponent")
);
import { lazy, Suspense } from "react";

export default async function ExplorePage({ searchParams }) {

  const categoryId = searchParams?.categoryId;

  const queryClient = new QueryClient();
  await queryClient.ensureQueryData({
    queryKey: ["CATEGORY_GRAPH"],
    queryFn: () => loadLibraryInventory(categoryId),
  });
 

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ExploreComponent categoryId={categoryId} />
      </Suspense>
    </HydrationBoundary>
  );
}
