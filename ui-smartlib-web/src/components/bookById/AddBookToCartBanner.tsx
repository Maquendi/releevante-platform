"use client";

import { FetchBookById } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";


interface AddToCartProps {
  productId: string;
}

export default function AddBookToCartBanner({ productId }: AddToCartProps) {
  const { data: book } = useQuery({
    queryKey: ["BOOK_BY_ID", productId],
    queryFn: async () => await FetchBookById(productId),
  });

  const t = useTranslations("bookById");

  const { 
    maxBookAllowed, 
    booksInCartCount, 
    isBookInCart, 
    handleAddToCart, 
    selectedLanguage 
  } = useAddBookToCart();

  if (!book) return null;

  return (
    <div
      className={cn(
        "py-4 px-3 flex items-center justify-center gap-4 fixed bottom-0 left-0 right-0 bg-white transition-transform ease-in-out duration-300",
        isBookInCart(book.bookLanguages) && "translate-y-full" 
      )}
    >
      <Button
        disabled={!selectedLanguage || booksInCartCount.rentItemsCount >= maxBookAllowed!}
        onClick={() => handleAddToCart("RENT", book)}
        className="py-7 px-8 rounded-full font-medium hover:text-black hover:bg-accent"
      >
        {t("rentBannerBtn")}
      </Button>

      <Button
        disabled={!selectedLanguage || booksInCartCount.purchaseItemsCount >= maxBookAllowed!}
        variant="outline"
        onClick={() => handleAddToCart("PURCHASE", book)}
        className="py-7 px-8 rounded-full font-medium bg-transparent border-black"
      >
        <p className="flex items-center">
          <span>{t("buyBannerBtn")}</span>
          <span>
            <Dot />
          </span>
          <span>${book?.price}</span>
        </p>
      </Button>
    </div>
  );
}
