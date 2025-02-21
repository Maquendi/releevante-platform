'use client'

import { SaveServiceReview } from "@/actions/book-actions"
import { useRouter } from "@/config/i18n/routing"
import { useMutation } from "@tanstack/react-query"

export default function useSaveServiceReview() {
const router = useRouter()
  const saveBookMutation=useMutation({
    mutationFn:SaveServiceReview,
    onSuccess(){
      router.push('/')
    }
  })

  return saveBookMutation
}
