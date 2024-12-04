'use client'
import { authSignIn } from "@/actions/auth-actions";
import { fetchConfiguration } from "@/redux/features/settingsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/config/i18n/routing";
import { useState } from "react";

interface Credential{
  code:string
}

const useAuth = () => {
  const dispatch = useAppDispatch()
  const router=useRouter()
  const [error, setError] = useState<boolean>(false);

  const loginMutation= useMutation({
    mutationFn:(credentials:Credential)=>authSignIn(credentials.code),
    onSuccess(){
      dispatch(fetchConfiguration())
      router.push("/catalog");
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
