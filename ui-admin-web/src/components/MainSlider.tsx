"use client";

import React, { useMemo, useState } from "react";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRouter } from "@/config/i18n/routing";
import { useMediaQuery } from 'react-responsive'
import { useQuery } from "@tanstack/react-query";
import { FetchAllBooksByOrg } from "@/actions/book-actions";
import { Skeleton } from "./ui/skeleton";
import { Book } from "@/types/book";

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

    
  const { data: books,isPending} = useQuery({
    queryKey: ["LIBRARY_INVENTORY"],
    queryFn: async()=>FetchAllBooksByOrg(),
    refetchOnMount:false,
    refetchOnWindowFocus:false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const items:Book[] | any[] = useMemo(()=>(
    isPending
    ? Array.from({ length: 10 }, (_, index) => ({ id: index }))
    : Object.values(books || {})
  ),[books,isPending])

  return (
    <div>
      <Slider {...settings}>
        {items?.map((book, index) => (
          <article key={index}>
            <div
              onClick={() => router.push(`/catalog/book/${book?.isbn}?translationId=${book?.translationId}`)}
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
               {isPending ? (
                  <Skeleton
                    className="rounded-xl object-cover w-full h-full bg-gray-200"
                  />
                ) : (
                  <Image
                    className="rounded-xl object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    fill
                    src={book?.image}
                    alt={`image-for-${book?.bookTitle}`}
                  />
                )}
            </div>
          </article>
        ))}
      </Slider>
    </div>
  );
}
