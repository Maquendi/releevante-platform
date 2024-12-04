import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addItem } from "@/redux/features/cartSlice";
import { Book, BookCategory, BookLanguage } from "@/book/domain/models";

export function useAddBookToCart() {
  const dispatch = useAppDispatch();

  const { items: cartItems, language: selectedLanguage } = useAppSelector(
    (state) => state.cart
  );
  const settings = useAppSelector((store) => store.settings.data);

  const maxBookAllowed = useMemo(() => {
    return settings ? parseInt(settings.maxBooksPerLoan!) : 4;
  }, [settings]);

  const booksInCartCount = useMemo(() => {
    const rentItemsCount =
      cartItems.filter((item) => item.transactionType === "RENT").length || 0;
    const purchaseItemsCount =
      cartItems.filter((item) => item.transactionType === "PURCHASE").length ||
      0;
    return { rentItemsCount, purchaseItemsCount };
  }, [cartItems]);

  const isBookInCart = (bookLanguages: BookLanguage[]): boolean => {
    const cartIsbns = cartItems.map((item) => item.isbn);
    return bookLanguages.some((book) => cartIsbns.includes(book.bookId));
  };

  const cartItemPayload = (book: Book) => {
    const bookId = book.bookLanguages.find(
      (item) => item.language === selectedLanguage
    )?.bookId;
    if (!book || !bookId) return;
    return {
      isbn: bookId!,
      title: book.bookTitle,
      image: book.images?.[0]?.url || "",
      qty: 1,
      price: book.price,
    };
  };

  const handleAddToCart = (transactionType: "RENT" | "PURCHASE", book: any) => {
    if (
      transactionType === "RENT" &&
      booksInCartCount.rentItemsCount >= maxBookAllowed
    )
      return;
    if (
      transactionType === "PURCHASE" &&
      booksInCartCount.purchaseItemsCount >= maxBookAllowed
    )
      return;
    const payload = cartItemPayload(book);
    if (payload) {
      dispatch(addItem({ ...payload, transactionType }));
    }
  };

  return {
    maxBookAllowed,
    booksInCartCount,
    isBookInCart,
    handleAddToCart,
    selectedLanguage,
  };
}
