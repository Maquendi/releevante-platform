"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FetchBookById } from "@/actions/book-actions";
import { useTranslations } from "use-intl";
import BookByIdBanner from "./BookByIdBanner";
import { useLocale } from "next-intl";
import { Locales } from "@/types/globals";
import AddBookToCartBanner from "./AddBookToCartBanner";

interface BookDetailsProps {
  isbn: string;
  translationId: string;
}
export default function BookDetails({ isbn, translationId }: BookDetailsProps) {
  const { data: book } = useQuery({
    queryKey: ["BOOK_BY_ID", isbn],
    queryFn: async () => await FetchBookById(isbn, translationId),
  });
  const locale = useLocale();
  const [selectedBookTranslationId, setSelectedBookTranslationId] =
    useState("");

  useEffect(() => {
    if (!book?.length) return;
    setSelectedBookTranslationId(book?.[0].isbn);
  }, [book]);

  const selectedBookTranslation = useMemo(() => {
    if (!book?.length) return;
    return book?.find((book) => book.isbn === selectedBookTranslationId);
  }, [book, selectedBookTranslationId]);

  const t = useTranslations("bookById");
  
  return (
    <section className="relative mt-7 space-y-10">
      <BookByIdBanner
        selectedBook={selectedBookTranslation!}
        book={book!}
        setSelectedBookTranslationId={setSelectedBookTranslationId}
      />
      <div className="border-b border-secondary-foreground py-4">
        <h3 className="text-xl font-semibold mb-2">{t("bookSummary")}</h3>
        <p className=" font-light">
          {selectedBookTranslation?.description?.[locale as Locales]}
        </p>
      </div>
      <div className=" py-4">
        <h3 className="text-xl font-semibold mb-2">{t("bookDetail")}</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {" "}
              {t("printLength")}
            </h4>
            <p>{selectedBookTranslation?.printLength}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("publicationDate")}
            </h4>
            <p>{selectedBookTranslation?.publishDate}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("dimensions")}
            </h4>
            <p>{selectedBookTranslation?.dimensions}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("language")}
            </h4>
            <p>{selectedBookTranslation?.language}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("publisher")}
            </h4>
            <p>{selectedBookTranslation?.publisher}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">ISBN-10</h4>
            <p>{selectedBookTranslation?.publicIsbn}</p>
          </div>
        </div>
      </div>
      <AddBookToCartBanner book={selectedBookTranslation!}/>
    </section>
  );
}
