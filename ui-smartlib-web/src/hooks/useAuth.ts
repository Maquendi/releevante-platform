"use client";
import { authSignIn, authSignOut, getAuthToken } from "@/actions/auth-actions";
import { fetchConfiguration } from "@/redux/features/settingsSlice";
import { useAppDispatch } from "@/redux/hooks";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { multiAction } from "@/redux/actionCreators";
import { clearCart } from "@/redux/features/cartSlice";
import { clearCheckout } from "@/redux/features/checkoutSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { fetchUserTransactions } from "@/actions/book-transactions-actions";

interface Credential {
  code: string;
}

const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [isUserSignin, setIsUserSignin] = useState<boolean>(false);
  const queryClient= useQueryClient()
  const loginMutation = useMutation({
    mutationFn: (credentials: Credential) => authSignIn(credentials.code),
    onSuccess() {
      setIsUserSignin(true);
      const redirectUrl = searchParams?.get("redirect") || `/${locale}/selection`;
      router.push(redirectUrl);
      queryClient.invalidateQueries({ queryKey: ["BOOKS_BY_CATEGORIES"] });
    },
    onError() {
      setError(true);
    },
  });

  const clearError = () => {
    setError(false);
  };

  useEffect(() => {
    (async () => {
      const { userId } = await getAuthToken();
      if (userId?.value) {
        setIsUserSignin(true);
      }
    })();
  }, []);

  useEffect(()=>{
     if(isUserSignin){
      queryClient.prefetchQuery({
        queryKey:['RETURN_BOOKS'],
        queryFn:async()=>await fetchUserTransactions()
      })
     }
  },[isUserSignin])

  const logoutMutation = useMutation({
    mutationFn: () => authSignOut(),
    onSuccess() {
      dispatch(multiAction([clearCart(), clearCheckout()]));
      queryClient.invalidateQueries({queryKey:['RETURN_BOOKS'],refetchType:'none'})
      router.push("/");
    },
  });

  return {
    loginMutation,
    logoutMutation,
    error,
    clearError,
    isUserSignin,
  };
};

export default useAuth;
