"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import ImageWithSkeleton from "./ImageWithSkeleton";
import Rating from "./Rating";
import { useTranslations } from "next-intl";

type Book = {
  imageUrl: string;
  bookTitle: string;
  rating:number
  votes:number
  
};

type SliderProps = {
  books: Book[];
  slidesToShow?: number;
};

const Slider: React.FC<SliderProps> = ({ books, slidesToShow = 3 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("homePage");


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
    <div className=" w-full overflow-hidden " >
      <div className=" absolute right-3 top-5 flex justify-end pb-1 px-4">
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="border border-[#CCCACA] grid place-content-center  p-2 rounded-full z-10"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="border border-[#CCCACA] p-2 rounded-full z-10 grid place-content-center"
          >
            <ChevronRight />
          </button>
          <button className="border border-[#827F7F] py-2 px-4 rounded-full text-xs font-medium">
            {t('seeAll')}
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth mx-2 space-x-3 no-scrollbar"
        
      >
        {books.map(async(book, index) => (
          <div
            className="flex-shrink-0 space-y-4 w-[30%]  text-center snap-start"
            key={index}
          >
            <ImageWithSkeleton
              src={book.imageUrl}
              alt={book.bookTitle}
              width={250}
              height={250}
              className="w-full h-[250px] object-cover rounded-lg "

            />
            <div className="flex text-end text-secondary-foreground items-center gap-3">
              <Rating rating={book.rating}/>
              <p >{book.rating}</p>
              <p> ({book.votes} votes)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
