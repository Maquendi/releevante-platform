"use client";
import React, {  } from "react";
import Rating from "../Rating";
import { IBookDetail } from "@/book/domain/models";
import { useLocale, useTranslations } from "next-intl";
import ImageWithSkeleton from "../ImageWithSkeleton";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";

interface BookByIdBannerProps {
  selectedBook?: IBookDetail | null;
  relatedBooks?: IBookDetail[];
  setSelectedBook: (isbn: string) => void;
}
export default function BookByIdBannerV2({
  selectedBook,
  relatedBooks,
  setSelectedBook,
}: BookByIdBannerProps) {
  const locale = useLocale();
  const t = useTranslations("bookById");

  if (!selectedBook) return;

  return (
    <div className="flex gap-5 p-3 rounded-md m-auto bg-white px-5 py-10">
      <div>
        <ImageWithSkeleton
          className="rounded-xl object-cover"
          src={selectedBook?.image}
          width={250}
          height={300}
          alt="image book"
        />
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex gap-2 mb-5">
          {selectedBook?.categories?.map((category, index) => (
            <p
              key={index}
              className="bg-primary py-1 px-2 rounded-sm text-white text-sm font-medium"
            >
              <span>{category?.[`${locale}`]}</span>
            </p>
          ))}
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-semibold">{selectedBook?.bookTitle}</h2>
          <p className="font-medium text-2xl text-secondary-foreground">
            {selectedBook?.author}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Rating rating={selectedBook?.rating || 0} />
          <p className="text-secondary-foreground text-sm">
            {selectedBook?.rating}
          </p>
          <p className="text-secondary-foreground text-sm">
            ({selectedBook?.votes || 0} votes)
          </p>
        </div>
        <div className="border-t border-secondary pt-3">
          <h4 className="font-medium mb-1">{t("selectLanguage")}</h4>
          <div className="flex gap-4 items-center">
            {relatedBooks?.map(({ isbn, language }) => (
              <button
                suppressHydrationWarning
                className={cn(
                  "font-medium flex gap-2 items-center px-5 py-4 rounded-full border border-secondary",
                  isbn === selectedBook?.isbn && "bg-black text-white"
                )}
                key={isbn}
                onClick={() => setSelectedBook(isbn)}
              >
                {isbn === selectedBook?.isbn && (
                  <CircleCheck className="h-4 w-4 fill-white text-black" />
                )}
                <span className="first-letter:uppercase"> {language}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
