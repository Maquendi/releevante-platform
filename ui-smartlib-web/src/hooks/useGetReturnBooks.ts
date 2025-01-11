import { FetchUserBooksLoan } from "@/actions/cart-actions";
import { useQuery } from "@tanstack/react-query";
import useImagesIndexDb from "./useImagesIndexDb";
import { useEffect, useState } from "react";
import { LoanGroup } from "@/core/domain/loan.model";

export default function useGetReturnBooks() {
  const [returnBooksWithImages, setReturnBooksWithImages] = useState<
    LoanGroup[]
  >([]);

  const { getImageByBookId } = useImagesIndexDb();
  const [isPending,setIsPending]=useState<boolean>(true)

  const { data: userReturnBooks = [] } = useQuery({
    queryKey: ["RETURN_BOOKS"],
    queryFn: async () => await FetchUserBooksLoan(),
  });

  useEffect(() => {
    setIsPending(true);
    (async () => {
      const bookImagesPromises = userReturnBooks.map(async (item) => ({
        returnDate: item.returnDate,
        books: await Promise.all(
          item.books.map(async (book) => ({
            ...book,
            image: (await getImageByBookId({id:book.id,image:book.image})) || book.image,
          }))
        ),
      }));
      const bookWithImages = await Promise.all(bookImagesPromises);
      setReturnBooksWithImages(bookWithImages);
      setIsPending(false)
    })();
  }, [userReturnBooks]);

  return{
    userReturnBooks:returnBooksWithImages,
    isPending
  }
}
