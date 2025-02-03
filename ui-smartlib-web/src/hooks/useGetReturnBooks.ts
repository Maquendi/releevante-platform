import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BookTransaction } from "@/core/domain/loan.model";
import { fetchUserBookLoans } from "@/actions/book-transactions-actions";
import { useAppSelector } from "@/redux/hooks";

export default function useGetUserTransactions() {
  const [bookTransactions, setBookTransactions] = useState<BookTransaction[]>(
    []
  );

  const { currentItemForCheckin } = useAppSelector(
    (state) => state.returnbooks
  );

  // const { getImageByBookId } = useImagesIndexDb();
  const [isPending, setIsPending] = useState<boolean>(true);

  const { data: transactions = [] } = useQuery({
    queryKey: ["RETURN_BOOKS"],
    queryFn: async () => await fetchUserBookLoans(),
  });

  useEffect(() => {
    setIsPending(true);
    (async () => {
      const userTransactions = transactions.filter((transaction) => {
        return transaction.items.length > 0;
      });
      setBookTransactions([...userTransactions]);
      setIsPending(false);
    })();
  }, [transactions]);

  return {
    bookTransactions,
    isPending,
  };
}
