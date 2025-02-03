"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/config/i18n/routing";
import { PartialBook } from "@/book/domain/models";
import BookCard from "../bookcard/BookCard";
import { useRouter } from "@/config/i18n/routing";

import { useDispatch } from "react-redux";
import { setBookRecommendation } from "@/redux/features/pageTransitionSlice";

type SliderProps = {
  categoryId: string;
  subCategory: {
    id: string;
    books: PartialBook[];
  };
  slidesToShow?: number;
};

const SubCategorySlider: React.FC<SliderProps> = ({
  categoryId,
  subCategory,
  slidesToShow = 3,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("catalogPage");
  const { books, id: subCategoryId } = subCategory;
  const router = useRouter();
  const dispatch = useDispatch();

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

  const navSeeAll = () => {
    dispatch(
      setBookRecommendation({
        id: "recommendations",
        en: "Recommendations",
        fr: "Recommandations",
        es: "Recomendaciones",
        subCategories: [
          {
            id: "recommendations",
            en: "Recommendations",
            fr: "Recommandations",
            es: "Recomendaciones",
            books: books,
          },
        ],
      })
    );
    router.push(`/explore/${categoryId}?subCategoryId=${subCategoryId}`);
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
            onClick={navSeeAll}
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
        {books!.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
};

export default SubCategorySlider;
