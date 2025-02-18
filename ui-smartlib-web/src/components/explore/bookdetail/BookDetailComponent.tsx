"use client";

import { loadBookDetail } from "@/actions/book-actions";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import Rating from "@/components/Rating";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { IBookDetail } from "@/book/domain/models";
import { useLocale, useTranslations } from "next-intl";

const BestSellerSlider = dynamic(
  () => import("@/components/search/BestSellerSlider"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const AddBookToCartBanner = dynamic(
  () => import("@/components/bookById/AddBookToCartBanner"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function BookDetailComponent({ isbn, translationId }) {
  const queryClient = new QueryClient();
  const { data: books = [] } = useQuery({
    queryKey: ["BOOK_BY_TRANSLATION_ID", translationId],
    queryFn: async () => {
      console.log("LOADING BOOK DETAILS ****************");
      return await loadBookDetail(translationId);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const t = useTranslations("bookById");

  const locale = useLocale();

  const getSelectedBook = (bookId: string) =>
    books?.find((item) => item.isbn == bookId);

  const [book, setBook] = useState<IBookDetail | undefined>(undefined);

  useEffect(() => {
    setBook(getSelectedBook(isbn));
  }, [books]);

  return (
    <section className="relative px-7 mt-7 space-y-10">
      <div className="flex gap-5 p-3 rounded-md m-auto bg-white px-5 py-10">
        <div>
          <ImageWithSkeleton
            className="rounded-xl object-cover"
            src={book?.image || ""}
            width={250}
            height={300}
            alt="image book"
          />
        </div>
        <div className="space-y-4 flex-1">
          <div className="flex gap-2 mb-5">
            {book?.categories?.map((category) => (
              <p
                key={category?.en}
                className="bg-primary py-1 px-2 rounded-sm text-white text-sm font-medium"
              >
                <span>{category?.[`${locale}`]}</span>
              </p>
            ))}
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-semibold">{book?.bookTitle}</h2>
            <p className="font-medium text-2xl text-secondary-foreground">
              {book?.author}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Rating rating={book?.rating || 0} />
            <p className="text-secondary-foreground text-sm">{book?.rating}</p>
            <p className="text-secondary-foreground text-sm">
              ({book?.votes || 0} votes)
            </p>
          </div>
          <div className="border-t border-secondary pt-3">
            <h4 className="font-medium mb-1">{t("selectLanguage")}</h4>

            <div className="flex gap-4 items-center">
              {books?.map(({ isbn, language }) => (
                <button
                  suppressHydrationWarning
                  className={cn(
                    "font-medium flex gap-2 items-center px-5 py-4 rounded-full border border-secondary",
                    isbn === book?.isbn && "bg-black text-white"
                  )}
                  key={isbn}
                  onClick={() => setBook(getSelectedBook(isbn))}
                >
                  {isbn === book?.isbn && (
                    <CircleCheck className="h-4 w-4 fill-white text-black" />
                  )}
                  <span className="first-letter:uppercase"> {language}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-secondary-foreground py-4">
        <h3 className="text-xl font-semibold mb-2">{t("bookSummary")}</h3>
        <p className=" font-light">{book?.[`${locale}`] || ""}</p>
      </div>
      <div className="border-b border-secondary-foreground py-4">
        <h3 className="text-xl font-semibold mb-2">{t("bookDetail")}</h3>
        <div className="grid grid-cols-3 grid-rows-2 gap-3">
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {" "}
              {t("printLength")}
            </h4>
            <p>{book?.printLength}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("publicationDate")}
            </h4>
            <p>{book?.publicationDate}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("dimensions")}
            </h4>
            <p>{book?.dimensions}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("language")}
            </h4>
            <p>{books?.map((b) => b.language).join(",")}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("publisher")}
            </h4>
            <p>{book?.publisher}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">ISBN-10</h4>
            <p>{book?.isbn}</p>
          </div>
        </div>
      </div>
      <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <BestSellerSlider />
        </HydrationBoundary>
      </div>
      <AddBookToCartBanner book={book!} />
    </section>
  );
}
