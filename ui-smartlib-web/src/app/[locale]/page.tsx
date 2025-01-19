"use server";
import {
  FetchAllBooks,
  loadLibraryInventory,
  loadPartialBooksPaginated,
  LoanLibraryInventory,
} from "@/actions/book-actions";
import RestHomePage from "@/components/restHome/RestHomePage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Home() {
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["ALL_BOOKS"],
  //   queryFn: async () => await LoanLibraryInventory({ limit: 25 }),
  // });

  // const queryClient = new QueryClient();
  // await queryClient.ensureQueryData({
  //   queryKey: ["CATEGORY_GRAPH", "All"],
  //   queryFn: async () => await loadLibraryInventory(),
  // });

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
