import { FetchFtagsBy } from "@/actions/book-actions";
import UserSelectionComponent from "@/components/selection/user-selection";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

export default async function SelectionPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["READING_VIBE"],
    queryFn: async () => await FetchFtagsBy("reading_vibe"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserSelectionComponent />
    </HydrationBoundary>
  );
}
