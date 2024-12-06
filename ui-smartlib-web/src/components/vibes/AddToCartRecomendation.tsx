"use client";

import { FetchBookById } from "@/actions/book-actions";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { Book } from "@/book/domain/models";

interface AddToCartRecomendationProps {
  book: Book;
}

export default function AddToCartRecomendation({
  book,
}: AddToCartRecomendationProps) {
  const t = useTranslations("recommendationsPage");

  const {
    maxBookAllowed,
    booksInCartCount,
    isBookInCart,
    handleAddToCart,
    selectedLanguage,
  } = useAddBookToCart();

  if (!book) return null;

  return (
    <div
      className={cn(
        "py-4 px-3 flex items-center justify-between gap-4 fixed bottom-0 left-0 right-0 bg-white transition-transform ease-in-out duration-300",
        isBookInCart(book.bookLanguages) && "translate-y-full"
      )}
    >
      <div>
        <Button className="py-7 px-8 bg-transparent rounded-full font-medium text-primary border border-primary hover:text-black hover:bg-accent">
          <span className="first-letter:uppercase">
            {t("editPreferences")}
          </span>
        </Button>
      </div>
      <div className="space-x-4">
        <Button
          disabled={
            !selectedLanguage ||
            booksInCartCount.rentItemsCount >= maxBookAllowed!
          }
          onClick={() => handleAddToCart("RENT", book)}
          className="py-7  px-8 rounded-full font-medium hover:text-black hover:bg-accent"
        >
          <span className="first-letter:uppercase"> {t("rent")}</span>
        </Button>

        <Button
          disabled={
            !selectedLanguage ||
            booksInCartCount.purchaseItemsCount >= maxBookAllowed!
          }
          variant="outline"
          onClick={() => handleAddToCart("PURCHASE", book)}
          className="py-7 px-8 rounded-full font-medium bg-transparent border-black"
        >
          <p className="flex items-center">
            <span className="first-letter:uppercase">{t("buy")}</span>
          </p>
        </Button>
      </div>
    </div>
  );
}
