'use client'
import { useRouter } from '@/config/i18n/routing';
import { CartItemState, removeItem, updateItem } from '@/redux/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import  { useEffect } from 'react'
import { ReservedItemType } from '@/types/book';
import useGetCartBooks from './useGetCartBooks';

export default function useGetReviewCartBooks() {
     const cartItems = useAppSelector((store) => store.cart.items);
      const { rentItems, purchaseItems, allItems } = useGetCartBooks<CartItemState>(cartItems);
      const router = useRouter();
      useEffect(() => {
        if (rentItems.length || purchaseItems.length) return;
        router.push("/catalog");
      }, [rentItems, purchaseItems, router]);
      const dispatch = useAppDispatch();
    
      const handleMoveBook = (isbn: string, itemType: ReservedItemType) => {
        const transactionType = itemType === "RENT" ? "PURCHASE" : "RENT";
        dispatch(updateItem({ isbn, transactionType }));
      };
    
      const handleRemoveItem = (isbn: string) => {
        dispatch(removeItem({ isbn }));
      };
  return (
    {
        handleMoveBook,
        handleRemoveItem,
        rentItems,
        purchaseItems,
        allItems
    }
  )
}

