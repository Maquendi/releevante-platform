"use client";

import {
  bookRecomendationsByTags,
  loadBookDetail,
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

  const bookByTranslationId = (translationId) => {
    const { data: booksDetail } = useQuery({
      queryKey: ["BOOK_BY_TRANSLATION_ID", translationId],
      queryFn: async () => await loadBookDetail(translationId),
    });

    return booksDetail!;
  };

  return {
    recomendations,
    bookByTranslationId,
  };
}
