'use client'

import { SaveBookReview } from "@/actions/book-actions"
import { useRouter } from "@/config/i18n/routing"
import { useMutation } from "@tanstack/react-query"

export default function useSaveBookReview() {
const router = useRouter()
  const saveBookMutation=useMutation({
    mutationFn:SaveBookReview,
    onSuccess(){
      router.push('/')
    }
  })

  return saveBookMutation
}
