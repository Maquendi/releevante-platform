"use client";
import {  useMutation } from "@tanstack/react-query";
import {  useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { authClientAcessId, authSignOut } from "@/actions/auth-actions";

interface Credential {
  code: string;
}

const useAuth = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const locale = useLocale();

  const loginClientId = useMutation({
    mutationFn: (clientId:string) =>authClientAcessId(clientId),
    onSuccess() {
      const redirectUrl = searchParams?.get("redirect_url") || `/${locale}/`;
      router.push(redirectUrl);
    },
    onError() {
      setError(true);
    },
  });


  const loginMutation = useMutation({
    mutationFn: (credentials: Credential) => authClientAcessId(credentials.code),
    onSuccess() {
      const redirectUrl = searchParams?.get("redirect_url") || `/${locale}/`;
      router.push(redirectUrl);
    },
    onError() {
      setError(true);
    },
  });

  const clearError = () => {
    setError(false);
  };

  const logoutMutation = useMutation({
    mutationFn: () => authSignOut(),
    onSuccess() {
      router.push("/");
    },
  });

  return {
    loginMutation,
    logoutMutation,
    error,
    clearError,
    loginClientId
  };
};

export default useAuth;
