"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/config/i18n/routing";
import { Book } from "@/types/book";

interface AddToCartRecomendationProps {
  book: Book | null;
}

export default function AddToCartRecomendation({
  book,
}: AddToCartRecomendationProps) {
  const t = useTranslations("recommendationsPage");
  const router = useRouter();
 

  const ediPreferences = () => {
    const url = `readingvibe`;
    router.push(url);
  };

  if (!book) return null;

  return (
    <div
      className={cn(
        "py-4 px-3 !z-[999] flex items-center justify-between gap-4 fixed bottom-0 left-0 right-0 bg-white transition-transform ease-in-out duration-300",
      )}
    >
      <div>
        <Button onClick={ediPreferences} className="py-7 px-8 bg-transparent rounded-full font-medium text-primary border border-primary hover:text-black hover:bg-accent">
          <span className="first-letter:uppercase">{t("editPreferences")}</span>
        </Button>
      </div>
      <div className="space-x-4">

        <Button
       
          variant="outline"
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
