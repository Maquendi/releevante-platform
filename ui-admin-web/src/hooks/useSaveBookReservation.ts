'use client'

import { SaveReservationBooks } from "@/actions/book-actions"
import { usePathname, useRouter } from "@/config/i18n/routing"
import { ReservationItem } from "@/types/book"
import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

export default function useSaveBookReservation() {
    const router = useRouter();
    const path = usePathname();
    const locale = useLocale();
    return useMutation({
        mutationFn:(items:ReservationItem[])=>SaveReservationBooks(items),
        onSuccess:()=>{
            router.push('/thanks')
        },
        onError(err){
            if(err.message === 'UNAUTHORIZED'){
                const searchparams = new URLSearchParams()
                searchparams.set('redirect_url',`/${locale}${path}`);
                router.push(`/auth/code?${searchparams.toString()}`)
            }
        }
    })
}
