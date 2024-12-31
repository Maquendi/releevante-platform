"use server";
import { FetchAllBooks, LoanLibraryInventory } from "@/actions/book-actions";
import RestHomePage from "@/components/restHome/RestHomePage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["ALL_BOOKS"],
    queryFn: () => LoanLibraryInventory({ limit: 25 }),
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RestHomePage/>
    </HydrationBoundary>
  )
}
