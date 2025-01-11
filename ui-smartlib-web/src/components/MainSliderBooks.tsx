"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRouter } from "@/config/i18n/routing";
import useGetAllBooks from "@/hooks/useGetAllBooks";

export default function MainSliderBooks() {
  const [oldSlide, setOldSlide] = useState(0);
  const [activeSlide, setActiveSlide] = useState(1);

  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    initialSlide: 1,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "10%",
    useCSS: true,
    className: "space-x-2  z-10",
    useTransform: true,
    draggable: true,
    beforeChange: (current, next) => {
      setOldSlide(current);
      setActiveSlide(next);
    },
  };
  const router = useRouter();

  const getNextSlide = (index) => (index === activeSlide + 1 ? true : false);

  const {books}=useGetAllBooks({limit:25})

  return (
    <div>
      <Slider {...settings}>
        {books?.map((book, index) => (
          <article key={index}>
            <div
              onClick={() => router.push(`/catalog/book/${book.correlationId}`)}
              className={`relative duration-500 mx-2 rounded-lg z-10  ${
                activeSlide === index
                  ? "shadow-xl h-[300px]  translate-y-[20%] "
                  : oldSlide === index
                  ? " h-[450px]  translate-y-0 "
                  : getNextSlide(index)
                  ? " opacity-50 h-[200px]  translate-y-[50%]"
                  : "opacity-50 h-[200px] translate-y-[50%]"
              }`}
            >
              <Image
                className="rounded-xl object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                fill
                src={book?.image as any}
                alt={`image-for-${book.bookTitle}`}
              ></Image>
            </div>
          </article>
        ))}
      </Slider>
    </div>
  );
}
