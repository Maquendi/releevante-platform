"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import { BookDetails } from "@/types/book";


interface BookOptionsProps {
  book:BookDetails
}

export default function  BookOptions({ book }: BookOptionsProps) {


  const t = useTranslations("bookById");


  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4  bg-white ",
      )}
    >
      <Button
        className="py-7 px-8 rounded-full font-medium hover:text-black hover:bg-accent"
      >
        {t("rentBtn")}
      </Button>

      <Button
        variant="outline"
        className="py-7 px-8 rounded-full font-medium bg-transparent border-black"
      >
        <p className="flex items-center">
          <span>{t("buyBtn")}</span>
          <span>
            <Dot />
          </span>
          <span>${book?.price}</span>
        </p>
      </Button>
    </div>
  );
}
