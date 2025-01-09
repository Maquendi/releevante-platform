"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/config/i18n/routing";
import { useSearchParams } from "next/navigation";
import BookItem from "./catalogByCategory/BookItem";
import { BookItems } from "@/book/domain/models";

type SliderProps = {
  books: BookItems[];
  slidesToShow?: number;
  subCategoryId?: string;
};

const Slider: React.FC<SliderProps> = ({
  books,
  subCategoryId,
  slidesToShow = 3,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("catalogPage");
  const searchParams = useSearchParams();

  const nextSlide = () => {
    if (ref.current) {
      const slideWidth = ref.current.clientWidth / slidesToShow;
      ref.current.scrollLeft += slideWidth;
    }
  };

  const prevSlide = () => {
    if (ref.current) {
      const slideWidth = ref.current.clientWidth / slidesToShow;
      ref.current.scrollLeft -= slideWidth;
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="absolute right-3 top-5 flex justify-end pb-1 px-4">
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="border border-[#CCCACA] grid place-content-center p-2 rounded-full z-10"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="border border-[#CCCACA] p-2 rounded-full z-10 grid place-content-center"
          >
            <ChevronRight />
          </button>
          <Link
            href={`/catalog/${
              searchParams?.get("categoryId") || "n"
            }/?subCategoryId=${subCategoryId}`}
            className="border grid place-content-center cursor-pointer border-[#827F7F] py-2 px-4 rounded-full text-xs font-medium"
          >
            {t("seeAll")}
          </Link>
        </div>
      </div>

      <div
        ref={ref}
        className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth mx-2 space-x-3 no-scrollbar"
      >
        {books?.map((book) => (
          <BookItem key={book.isbn} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
