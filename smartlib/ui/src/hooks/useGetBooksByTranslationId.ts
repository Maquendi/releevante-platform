import { loadBookDetail } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";

export default function useGetBooksByTranslationId(translationId){

    const { data: books = [] } = useQuery({
        queryKey: ["BOOK_BY_TRANSLATION_ID", translationId],
        queryFn: async () => await loadBookDetail(translationId),
      });

      return books
}