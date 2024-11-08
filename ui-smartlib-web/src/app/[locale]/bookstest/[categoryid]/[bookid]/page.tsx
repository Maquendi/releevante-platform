"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/features/cartSlice";
import Link from "next/link";
import { FetchBookById } from "@/actions/book-actions";
import { Book } from "@/book/domain/models";



const Page = ({ params }: { params: Record<string, any> }) => {
  const id = params?.bookid;

  const [bookItem, setBookItem] = useState<Book | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    FetchBookById(id).then((data) => setBookItem(data));
  }, [id]);

  if (!bookItem) return;


  const handleAddToCart = async () => {
    try {
      const bookImages = bookItem?.images?.length ? bookItem.images[0] : null;
      dispatch(
        addItem({
          qty: 1,
          image:bookImages!.url!,
          title: bookItem!.bookTitle,
          isbn:bookItem!.isbn!
        })
      );
    } catch (error) {
      console.error("Error al agregar el artículo al carrito:", error);
    }
  };


  return (
    <div className="flex justify-center gap-10 mt-10 p-4">
      
      <div>
        <figure>
          <Image
            width={500}
            height={500}
            src={bookItem?.images[0].url!}
            alt="book image"
          ></Image>
        </figure>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">{bookItem?.bookTitle}</h2>
        <h2 className="text-2xl font-semibold">{bookItem.editionTitle}</h2>

       
        <div className="space-y-2 mt-10">
          <button
            onClick={handleAddToCart}
            className="bg-blue-300 w-full p-3 rounded-md"
          >
            Add to cart
          </button>
          <button className="bg-yellow-500 w-full p-3 rounded-md">
          <Link  href={"/en/cart"}>
            Go to cart
          </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
