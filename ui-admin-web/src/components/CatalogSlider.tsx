"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/config/i18n/routing";
import BookItem from "./catalogByCategory/BookItem";
import { Skeleton } from "./ui/skeleton";

type SliderProps = {
  books: any[];
  categoryId: string;
  subCategoryId?: string;

  slidesToShow?: number;
};

export function CatalogSliderSkeleton() {
  return (
    <div className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth mx-2 space-x-3 no-scrollbar">
      <Skeleton className="w-full md:w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-full md:w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-full md:w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-full md:w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-full md:w-[30%] h-[250px] rounded-md" />
    </div>
  );
}

const Slider: React.FC<SliderProps> = ({
  books,
  categoryId,
  subCategoryId,
  slidesToShow = 3,
}) => {
  const t = useTranslations("catalogPage");
  const ref = useRef<HTMLDivElement | null>(null);

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
    <div className="flex gap-y-3 flex-col-reverse w-full overflow-hidden">
      <div className="w-full sm:w-fit sm:absolute right-3 top-5 flex justify-end pb-1 px-4">
        <div className="w-full flex gap-2">
          <div className="hidden space-x-2  sm:flex items-center">
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
          </div>
          <Link
            href={`/catalog/${categoryId}/?subCategoryId=${subCategoryId}`}
            className="w-full md:w-fit border cursor-pointer border-[#827F7F] py-3 px-4 rounded-full text-xs font-medium text-center"
          >
            {t("seeAll")}
          </Link>
        </div>
      </div>

      <div
        ref={ref}
        className="grid grid-cols-2  gap-2 place-items-center sm:flex  sm:overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth ml-2 mr-4 sm:mr-2 space-x-3 no-scrollbar"
      >
        {books?.map((book) => (
          <BookItem key={book?.isbn} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
