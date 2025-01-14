import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addItem } from "@/redux/features/cartSlice";
import { Book, BookLanguage, IBookDetail } from "@/book/domain/models";
import useSyncImagesIndexDb from "./useImagesIndexDb";

export function useAddBookToCart(selectedBook: IBookDetail) {
  const dispatch = useAppDispatch();
  const { getImageByBookId } = useSyncImagesIndexDb();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const settings = useAppSelector((store) => store.settings.data);

  const hasEnoughCopies = useMemo(() => {
    return selectedBook?.qty > 0;
  }, [selectedBook]);

  const canBeSold = useMemo(() => {
    return (
      selectedBook?.qtyForSale > 0
    );
  }, [selectedBook]);

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

  const isBookInCart = (book: IBookDetail): boolean => {
    return !!cartItems.find((item) => item.isbn == book.isbn);
  };

  const cartItemPayload = async (book: IBookDetail) => {
    const bookImage = await getImageByBookId({
      id: book.isbn,
      image: book.image,
    });

    return {
      isbn: book.isbn!,
      title: book.bookTitle,
      image: bookImage || (book?.image as string),
      qty: 1,
      price: book.price,
      categories: book.categories.map((category) => ({
        id: category.id,
        tagName: "category",
        enTagValue: category.en,
        frTagValue: category.fr,
        esTagValue: category.es,
      })),
      author: book.author,
    };
  };

  const handleAddToCart = async (
    transactionType: "RENT" | "PURCHASE",
    book: IBookDetail
  ) => {
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
    const payload: any = await cartItemPayload(book);
    if (payload) {
      dispatch(addItem({ ...payload, transactionType }));
    }
  };

  return {
    maxBookAllowed,
    booksInCartCount,
    isBookInCart,
    handleAddToCart,
    hasEnoughCopies,
    canBeSold,
  };
}
