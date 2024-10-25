"use client";

import { fetchBookImages, syncImagesInIndexDb } from "@/app/[locale]/bookstest/[id]/helper";
import Image from "next/image";
import { useEffect, useState } from "react";


const BookDetailsPage = ({ book }: any) => {
  const [bookImages, setBookImages] = useState<string[]>([]);

 

  useEffect(() => {
    
    if (window.navigator.onLine && book) {
      const allImages = book.images;
      setBookImages(allImages);
      syncImagesInIndexDb(book)
      return;
    }

    fetchBookImages({ book_id: book.id })
    .then((images) => {
      setBookImages(images!);
    })
    

  }, [book]);

  return (
    <div>
      <h1>Detalles del Libro</h1>
      <div className="flex justify-center gap-5 mt-20 px-20">
      {bookImages.map((image: any, index) => (
        <div key={image.id} className="relative w-[300px] h-[300px] ">
          <Image
            fill
            key={index}
            className=" object-cover"
            sizes=" (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={image.url}
            alt={`Book image ${index}`}
          />
        </div>
      ))}
      </div>
    </div>
  );
};

export default BookDetailsPage;
