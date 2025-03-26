"use client";

import {
  bookRecomendationsByTags,
} from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";

export default function useGetRecomendationBooks({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const params = {
    usersFavFlavorOfStory: searchParams["favorstoryvibe"],
    usersCurrentMood: searchParams["moodvibe"],
    usersReadingPurpose: searchParams["readingvibe"],
  };
  const { data: recomendations } = useQuery({
    queryKey: ["BOOK_RECOMENDATION", searchParams],
    queryFn: async () => {
      return await bookRecomendationsByTags(params);
    },
  });

  return {
    recomendations
  };
}
