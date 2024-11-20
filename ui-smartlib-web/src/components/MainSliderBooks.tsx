"use client";

import React, { useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {  useSuspenseQuery } from "@tanstack/react-query";
import { FetchAllBooks } from "@/actions/book-actions";
import Image from "next/image";

export default function MainSliderBooks() {
  const [oldSlide, setOldSlide] = useState(0);
  const [activeSlide, setActiveSlide] = useState(1);

  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay:true,
    autoplaySpeed:3000,
    centerMode: true, 
    centerPadding: "10%", 
    useCSS: true,
    className: "space-x-2  z-10",
    useTransform: true,
    draggable:true,
    beforeChange: (current, next) => {
      setOldSlide(current);
      setActiveSlide(next);
    },
  };

  const getNextSlide = (index) => (index === activeSlide + 1 ? true : false);

  const {data:books} = useSuspenseQuery({
    queryKey:['ALL_BOOKS'],
    queryFn:()=>FetchAllBooks({limit:25})
  })


  const bookList=useMemo(()=>{
    return books?.filter(book=>book?.images?.length)
  },[books])


  return (
    <div >
      <Slider {...settings}>
        {bookList?.map((book,index) => (
          <article key={index}>
            <div
              className={` duration-500 mx-2 rounded-lg z-10  ${
                activeSlide === index
                  ? "shadow-xl h-[300px]  translate-y-[20%] "
                  : oldSlide === index
                  ? " h-[450px]  translate-y-0 " 
                  : getNextSlide(index)
                  ? " opacity-50 h-[200px]  translate-y-[50%]" 
                  : "opacity-50 h-[200px] translate-y-[50%]" 
              }`}
            >

              <Image className="rounded-xl object-cover" fill src={book?.images?.length? book.images[0].url!:'/images/releevante.svg'} alt={`image-for-${book.bookTitle}`}></Image>
            </div>
          </article>
        ))}
      </Slider>
    </div>
  );
}

