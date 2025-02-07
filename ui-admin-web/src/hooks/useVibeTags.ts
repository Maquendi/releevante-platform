import { FetchVibeTags } from "@/actions/book-actions";
import { VibeTag, VibeType } from "@/types/book";
import { useQuery } from "@tanstack/react-query";

export default function useVibeTags() {
  const { data: vibeTags,isPending } = useQuery({
    queryKey: ["VIBE_TAGS"],
    queryFn: async () => FetchVibeTags(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  function getTagsByType(vibeType: VibeType):VibeTag[] {
    if(!vibeTags?.length || isPending )return[]
    return vibeTags?.filter(
      (item) => item.name.toLocaleLowerCase() === vibeType.toLocaleLowerCase()
    );
  }

  return {
    vibeTags,
    getTagsByType,
  };
}
