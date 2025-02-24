'use client'

import { SaveReservationBooks } from "@/actions/book-actions"
import { useMutation } from "@tanstack/react-query"

export default function useSaveReservation() {

  const saveReservationBooks=useMutation({
    mutationFn:SaveReservationBooks,
    onSuccess(){
      
    }
  })
  return {
    saveReservationBooks
  }
}
