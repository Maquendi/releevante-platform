'use client'
import { useAppSelector } from "@/redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCurrentReturnBook } from "@/redux/features/returnbookSlice";
import { returnSingleBook } from "@/actions/returnbook-actions";
import { useEffect } from "react";
import { useRouter } from "@/config/i18n/routing";

export function useReturnBook() {
  const { currentReturnBook, completedBooks } = useAppSelector(
    (state) => state.returnbooks
  );
  const dispatch = useDispatch();
  const router= useRouter()
  const { mutate: returnBookMutation } = useMutation({
    mutationFn: returnSingleBook,
    onSuccess(loanItem) {
      console.log('loan item',loanItem)
      dispatch({ type: "socket/returnbook", event: "checkout", payload: loanItem });
    },
  });

  useEffect(()=>{
    if(!currentReturnBook.itemId)return
    returnBookMutation(currentReturnBook)
    if(currentReturnBook.status === 'return_successful'){
      router.push('/returnbook/thanks')
    }
  },[currentReturnBook])


  return {
    returnBookMutation,
    currentReturnBook,
    completedBooks,
  };
}
