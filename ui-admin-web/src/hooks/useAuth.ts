"use client";
import {  useMutation } from "@tanstack/react-query";
import {  useState } from "react";
import { useLocale } from "next-intl";
import { authSignIn, authSignOut } from "@/actions/auth-actions";
import {  useSearchParams } from "next/navigation";
import { useRouter } from "@/config/i18n/routing";

interface Credential {
  code: string;
}

const useAuth = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const locale = useLocale();

  const loginMutation = useMutation({
    mutationFn: (credentials: Credential) => authSignIn(credentials.code),
    onSuccess() {
      console.log('success auth')
      const redirectUrl = searchParams?.get("redirect") || `/${locale}/selection`;
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
  };
};

export default useAuth;
