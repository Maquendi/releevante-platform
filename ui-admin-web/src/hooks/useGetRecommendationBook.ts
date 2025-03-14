import { FetchRecomendationBook } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";

export default function useGetRecommendedBook(searchParams:Record<string,any>) {
  const tagsValues =  searchParams ? Object?.values(searchParams).join(',') : null
  const isTagValuesInParams=searchParams?.vibe ||searchParams?.flavor || searchParams?.mood
  const { data: recomendations,isPending } = useQuery({
    queryKey: ["RECOMMENDED_BOOK",tagsValues],
    queryFn: async () => FetchRecomendationBook(searchParams),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    enabled:!!isTagValuesInParams
  });

  return {
    recomendations,
    isPending
  };
}
