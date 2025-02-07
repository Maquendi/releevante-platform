'use client'
import Rating from "../Rating";
import { useLocale, useTranslations } from "next-intl";
import ImageWithSkeleton from "../ImageWithSkeleton";
import BookOptions from "./BookOptions";
import { BookDetails } from "@/types/book";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { Locales } from "@/types/globals";


interface BookByIdBannerProps {
  selectedBook: BookDetails;
  bookTranslations:BookDetails[]
  setSelectedBookId:(isbn:string)=>void
}
export default function BookByIdBanner({ bookTranslations,selectedBook,setSelectedBookId }: BookByIdBannerProps) {
  const locale = useLocale();
  const t = useTranslations("bookById");
  if (!bookTranslations) return;

  return (
    <div className="flex flex-col md:flex-row text-center md:text-left gap-5 p-3 rounded-md m-auto bg-white px-5 py-10 overflow-hidden:">
      <div>
        <ImageWithSkeleton
          className="rounded-xl object-cover"
          src={selectedBook?.image || ""}
          width={250}
          height={300}
          alt="image book"
        />
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex justify-center md:justify-start gap-2 mb-5">
          {selectedBook?.categories?.map((category) => (
            <p
              key={category.en}
              className="bg-primary py-1 px-2 rounded-sm text-white text-sm font-medium"
            >
              <span>{category?.[locale as Locales]}</span>
            </p>
          ))}
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-semibold">{selectedBook?.title}</h2>
          <p className="font-normal text-2xl text-secondary-foreground">
            {selectedBook?.publisher}
          </p>
        </div>
        <div className="flex gap-2 justify-center items-center md:justify-start">
          <Rating rating={selectedBook?.rating || 0} />
          <p className="text-secondary-foreground text-sm">{selectedBook?.rating}</p>
          <p className="text-secondary-foreground text-sm">
            ({selectedBook?.votes || 0} votes)
          </p>
        </div>
        <div className="flex  flex-col md:flex-row items-center md:items-stretch border-t border-gray-200 pt-3  gap-5  ">
          <div className="min-w-[200px]">
            <h4 className="font-medium mb-1">{t("selectLanguage")}</h4>
            <div className="flex gap-4 items-center">
              {bookTranslations?.map(({ isbn, language }) => (
                <button
                  suppressHydrationWarning
                  className={cn(
                    "font-medium flex gap-2 items-center px-5 py-4 rounded-full border border-secondary",
                    language === selectedBook?.language && "bg-black text-white"
                  )}
                  key={isbn}
                  onClick={() =>
                    setSelectedBookId(isbn)
                  }
                >
                  {selectedBook?.language === language && (
                    <CircleCheck className="h-4 w-4 fill-white text-black" />
                  )}
                  <span className="first-letter:uppercase"> {language}</span>
                </button>
              ))}
            </div>{" "}
          </div>
          <div className="border-l  border-gray-200 min-h-full hidden min-[1025px]:block"></div>
          <div className="hidden min-[1025px]:block">
            <h4 className="font-medium mb-1">Options</h4>
            <BookOptions book={selectedBook} />
          </div>
        </div>
      </div>
    </div>
  );
}
