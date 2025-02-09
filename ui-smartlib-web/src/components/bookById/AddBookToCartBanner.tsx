"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { IBookDetail } from "@/book/domain/models";
import { TransactionType } from "@/core/domain/loan.model";

interface AddToCartProps {
  book?: IBookDetail;
}

export default function AddBookToCartBanner({ book }: AddToCartProps) {
  const t = useTranslations("bookById");

  const {
    maxBookAllowed,
    booksInCartCount,
    isBookInCart,
    handleAddToCart,
    hasEnoughCopies,
    canBeSold,
  } = useAddBookToCart(book!);

  if (!book) return null;

  return (
    <div
      className={cn(
        "py-4 px-3 flex items-center justify-center gap-4 fixed bottom-0 left-0 right-0 bg-white transition-transform ease-in-out duration-300",
        isBookInCart(book) && "translate-y-full"
      )}
    >
      <Button
        disabled={
          booksInCartCount.rentItemsCount >= maxBookAllowed! || !hasEnoughCopies
        }
        onClick={async () => await handleAddToCart(TransactionType.RENT, book)}
        className="py-7 px-8 rounded-full font-medium hover:text-black hover:bg-accent"
      >
        {t("rentBannerBtn")}
      </Button>

      <Button
        disabled={
          booksInCartCount.purchaseItemsCount >= maxBookAllowed! || !canBeSold
        }
        variant="outline"
        onClick={async () =>
          await handleAddToCart(TransactionType.PURCHASE, book)
        }
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
