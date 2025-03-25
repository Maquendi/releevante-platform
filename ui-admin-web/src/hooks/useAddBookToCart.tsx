'use client'
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addItem } from "@/redux/features/cartSlice";
import { BookDetails } from "@/types/book";

export function useAddBookToCart(selectedBook:BookDetails) {
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector(
    (state) => state.cart
  );
  const settings = useAppSelector((store) => store.settings.data);


  const hasEnoughCopies= useMemo(()=>{
    if(!selectedBook)return
    return selectedBook.qty
  },[selectedBook])


  const maxBookAllowed = useMemo(() => {
    return settings ? settings.maxBooksPerLoan! : 4;
  }, [settings]);


  const booksInCartCount = useMemo(() => {
    const rentItemsCount =
      cartItems.filter((item) => item.transactionType === "RENT").length || 0;
    const purchaseItemsCount =
      cartItems.filter((item) => item.transactionType === "PURCHASE").length ||
      0;
    return { rentItemsCount, purchaseItemsCount };
  }, [cartItems]);

  const isBookInCart = (bookItem: any): boolean => {
    if(!bookItem)return false
    const cartIsbns = cartItems.map((item) => item.isbn);
    return cartIsbns.includes(bookItem.isbn)
  };

  const cartItemPayload = async (book: BookDetails) => {
 

    if (!book ) return;

    
    return {
      id:book.isbn,
      translationId:book.translationId,
      isbn: book.isbn!,
      title: book.title,
      image: book?.image as string,
      qty: 1,
      price: book.price,
      categories:book.categories,
      author:book.author,
      rating:book.rating,
      votes:book.votes,
      qtyForSale:book.qtyForSale
    };
  };

  const handleAddToCart = async (transactionType: "RENT" | "PURCHASE", book: any) => {
    if (
      (transactionType === "RENT" &&
      booksInCartCount?.rentItemsCount >= maxBookAllowed) || (transactionType === "PURCHASE" &&
        booksInCartCount?.purchaseItemsCount >= maxBookAllowed)
    )
      return;

    const payload = await cartItemPayload(book);
    if (payload) {
      dispatch(addItem({ ...payload, transactionType }));
    }
  };

  const isRentingDisable = 
  booksInCartCount.rentItemsCount >= maxBookAllowed! || 
  !hasEnoughCopies;

  const isPurchaseDisable = 
  ! booksInCartCount.purchaseItemsCount >= maxBookAllowed! || !hasEnoughCopies


  return {
    isBookInCart,
    handleAddToCart,
    isRentingDisable,
    isPurchaseDisable
  };
}
