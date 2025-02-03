"use server";
import {
  loadPartialBooksPaginated,
} from "@/actions/book-actions";
import RestHomePage from "@/components/restHome/RestHomePage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.ensureQueryData({
    queryKey: ["MAIN_SLIDER_BOOKS"],
    queryFn: async () =>
      await loadPartialBooksPaginated({
        page: 0,
        size: 100,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RestHomePage />
    </HydrationBoundary>
  );
}
