"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import BookItem from "./catalogByCategory/BookItem";
import {  PartialBook } from "@/book/domain/models";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "@/config/i18n/routing";

type SliderProps = {
  books: PartialBook[];
  slidesToShow?: number;
  params?: Record<string, string>;
};

export function CatalogSliderSkeleton() {
  return (
    <div className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth mx-2 space-x-3 no-scrollbar">
      <Skeleton className="w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-[30%] h-[250px] rounded-md" />
      <Skeleton className="w-[30%] h-[250px] rounded-md" />
    </div>
  );
}

const Slider: React.FC<SliderProps> = ({
  books,
  params = {},
  slidesToShow = 3,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("catalogPage");
  const router = useRouter();

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

  const navigateWithParams = () => {
    const queryString = new URLSearchParams(params).toString();
    const categoryId = params?.categoryId || "n";
    const url = `/catalog/${categoryId}?${queryString}`;
    router.push(url);
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
          <button
            onClick={navigateWithParams}
            className="border grid place-content-center cursor-pointer border-[#827F7F] py-2 px-4 rounded-full text-xs font-medium"
          >
            {t("seeAll")}
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth mx-2 space-x-3 no-scrollbar"
      >
        {books?.map((book, index) => (
          <BookItem key={index} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Slider;

