import { FetchRecomendationBook } from "@/actions/book-actions";
import { getQueryClient } from "@/app/getQueryClient";
import RecomendationPage from "@/components/vibes/RecommendationPage";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, any>;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["RECOMMENDED_BOOK", Object.values(searchParams).join(",")],
    queryFn: async () => FetchRecomendationBook(searchParams),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecomendationPage searchParams={searchParams} />
    </HydrationBoundary>
  );
}
