'use client'

import {SaveModifyReservations } from "@/actions/book-actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function useSaveModifyReservations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:SaveModifyReservations,
    onSuccess(){
      queryClient.invalidateQueries({queryKey:['RESERVATION_BOOKS'],refetchType:'active'})
    }
  })

}
