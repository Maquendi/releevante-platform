"use client";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import {  BookDetails } from "@/types/book";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";


interface AddToCartProps {
  book: BookDetails;
}

export default function AddBookToCartBanner({ book }: AddToCartProps) {
  
  const t = useTranslations("bookById");
  const {handleAddToCart,isBookInCart}=useAddBookToCart(book as any)
  
  if (!book) return null;

  const isBookAdded = isBookInCart(book)
  
  return (
    <div
      className={cn(
        "py-4 z-50 px-3 flex items-center justify-center gap-4 fixed bottom-0 left-0 right-0 bg-white transition-transform ease-in-out duration-300 min-[1025px]:hidden",
         isBookAdded && 'translate-y-full'
      )}
    >
      <Button
        onClick={()=>handleAddToCart('RENT',book)}
      
        className="py-7 px-8 rounded-full font-medium hover:text-black hover:bg-accent"
      >
        {t("readInHotelBtn")}
      </Button>

      <Button
        variant="outline"
        onClick={()=>handleAddToCart('PURCHASE',book)}
        className="py-7 px-8 rounded-full font-medium bg-transparent border-black"
      >
        <p className="flex items-center">
          <span>{t("buyBannerBtn")}</span>
          <span>
            <Dot />
          </span>
          <span>${book.price}</span>
        </p>
      </Button>
    </div>
  );
}
