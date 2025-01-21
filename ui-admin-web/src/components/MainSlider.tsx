"use client";

import React, { useState } from "react";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRouter } from "@/config/i18n/routing";
import mockJson from "../config/mockbooks.json";
import { useMediaQuery } from 'react-responsive'

export default function MainSliderBooks() {
  const [oldSlide, setOldSlide] = useState(0);
  const [activeSlide, setActiveSlide] = useState(1);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

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
    className: "space-x-2 md:min-h-[50%] z-10 grid place-content-center" ,
    useTransform: true,
    draggable: true,
    beforeChange: (current:any, next:any) => {
      setOldSlide(current);
      setActiveSlide(next);
    },
  };
  const router = useRouter();

  const getNextSlide = (index:number) => (index === activeSlide + 1 ? true : false);

  return (
    <div>
      <Slider {...settings}>
        {mockJson.json?.map((book, index) => (
          <article key={index}>
            <div
              onClick={() => router.push(`/catalog/book/${book.correlationId}`)}
              className={`relative duration-500 mx-2 rounded-lg z-10  ${
                activeSlide === index && !isTabletOrMobile 
                  ? "shadow-xl h-[300px]  translate-y-[20%] "
                  : oldSlide === index && !isTabletOrMobile
                  ? " h-[450px]  translate-y-0 "
                  : getNextSlide(index)
                  ? `opacity-50 h-[200px]  ${isTabletOrMobile ? 'translate-y-0':'translate-y-[50%]'}`
                  :`opacity-50 h-[200px]  ${isTabletOrMobile ? 'translate-y-0':'translate-y-[50%]'}`
              }`}
            >
              <Image
                className="rounded-xl object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                fill
                src={book?.image}
                alt={`image-for-${book.bookTitle}`}
              ></Image>
            </div>
          </article>
        ))}
      </Slider>
    </div>
  );
}
