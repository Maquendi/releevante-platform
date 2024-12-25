'use client'
import { authSignIn, authSignOut } from "@/actions/auth-actions";
import { fetchConfiguration } from "@/redux/features/settingsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "@/config/i18n/routing";
import { useState } from "react";
import { multiAction } from "@/redux/actionCreators";
import { clearCart } from "@/redux/features/cartSlice";
import { clearCheckout } from "@/redux/features/checkoutSlice";

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
      router.push("/home");
      queryClient.invalidateQueries({queryKey:['BOOKS_BY_CATEGORIES']})
    }, onError() {
      setError(true);
    },
  })

  const clearError=()=>{
    setError(false)
  }

  const logoutMutation= useMutation({
    mutationFn:()=>authSignOut(),
    onSuccess(){
      dispatch(multiAction([
        clearCart(),
        clearCheckout()
      ]))
      router.push("/");
    }
  })


  return {
    loginMutation,
    logoutMutation,
    error,
    clearError

  }
};

export default useAuth;
