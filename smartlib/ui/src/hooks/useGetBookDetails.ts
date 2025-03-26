import { loadBookDetail } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";

export const useGetBookDetails = (translationId: string) => {
    const { data: booksDetails = [] } = useQuery({
        queryKey: ["BOOK_BY_TRANSLATION_ID", translationId],
        queryFn: async () => {
            console.log("LOADING BOOK DETAILS ****************");
            return await loadBookDetail(translationId)
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: 0,
    });

    return {
        booksDetails
    };
};