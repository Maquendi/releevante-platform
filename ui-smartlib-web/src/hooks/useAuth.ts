'use client'
import { authSignIn } from "@/actions/auth-actions";
import { fetchConfiguration } from "@/redux/features/settingsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "@/config/i18n/routing";
import { useState } from "react";

interface Credential{
  code:string
}

const useAuth = () => {
  const dispatch = useAppDispatch()
  const router=useRouter()
  const [error, setError] = useState<boolean>(false);
  const queryClient= new QueryClient()
  const loginMutation= useMutation({
    mutationFn:(credentials:Credential)=>authSignIn(credentials.code),
    onSuccess(){
      dispatch(fetchConfiguration())
      router.push("/catalog");
      queryClient.invalidateQueries({queryKey:['BOOKS_BY_CATEGORIES']})
    }, onError() {
      setError(true);
    },
  })

  const clearError=()=>{
    setError(false)
  }

  return {
    loginMutation,
    error,
    clearError

  }
};

export default useAuth;
