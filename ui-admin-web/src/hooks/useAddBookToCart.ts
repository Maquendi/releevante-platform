'use client'
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addItem } from "@/redux/features/cartSlice";

export function useAddBookToCart(selectedBook:any) {
  const dispatch = useAppDispatch();
  const { items: cartItems, language: selectedLanguage } = useAppSelector(
    (state) => state.cart
  );
  const settings = useAppSelector((store) => store.settings.data);


  const hasEnoughCopies= useMemo(()=>{
    if(!selectedBook)return
    return selectedBook.copies[selectedLanguage!] > 0 ? true : false
  },[selectedBook,selectedLanguage])


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

  const isBookInCart = (bookLanguages: any[]): boolean => {
    const cartIsbns = cartItems.map((item) => item.isbn);
    return bookLanguages.some((book) => cartIsbns.includes(book.bookId));
  };

  const cartItemPayload = async (book: any) => {
    const bookId = book.languages.find(
      (item:any) => item.language === selectedLanguage
    )?.bookId;

    if (!book || !bookId) return;

    
    return {
      isbn: bookId!,
      title: book.bookTitle,
      image: book?.image as string,
      qty: 1,
      price: book.price,
      categories:book.categories,
      author:book.author
    };
  };

  const handleAddToCart = async (transactionType: "RENT" | "PURCHASE", book: any) => {
    if (
      (transactionType === "RENT" &&
      booksInCartCount.rentItemsCount >= maxBookAllowed) || (transactionType === "PURCHASE" &&
        booksInCartCount.purchaseItemsCount >= maxBookAllowed)
    )
      return;

    const payload = await cartItemPayload(book);
    if (payload) {
      dispatch(addItem({ ...payload, transactionType }));
    }
  };

  const isRentingDisable = 
  !selectedLanguage || 
  booksInCartCount.rentItemsCount >= maxBookAllowed! || 
  !hasEnoughCopies;

  const isPurchaseDisable = 
  !selectedLanguage || booksInCartCount.purchaseItemsCount >= maxBookAllowed! || !hasEnoughCopies


  return {
    isBookInCart,
    handleAddToCart,
    isRentingDisable,
    isPurchaseDisable
  };
}
