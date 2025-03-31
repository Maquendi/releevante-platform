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

export default async function ExplorePage() {
  const queryClient = new QueryClient();

  await queryClient.ensureQueryData({
    queryKey: ["BOOK_INVENTORY"],
    queryFn: async () => {
      console.log("LOADING BOOK INVENTORY* ******************** {ensureQueryData}")
      return await loadLibraryInventory();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ExploreComponent />
      </Suspense>
    </HydrationBoundary>
  );
}
