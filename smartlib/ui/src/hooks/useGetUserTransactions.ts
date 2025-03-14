import { useQuery } from "@tanstack/react-query";
import { fetchUserTransactions } from "@/actions/book-transactions-actions";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { BookTransaction } from "@/core/domain/loan.model";

export default function useGetUserTransactions() {
  const dispatch = useDispatch();
  // const { getImageByBookId } = useImagesIndexDb();
  const {
    data: bookTransactions,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["RETURN_BOOKS"],
    queryFn: async () => await fetchUserTransactions(),
  });
  
  return {
    bookTransactions,
    isPending,
    isError,
  };
}
