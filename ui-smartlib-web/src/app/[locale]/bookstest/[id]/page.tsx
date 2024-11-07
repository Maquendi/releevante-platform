"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBook } from "./data";
import { addItem } from "@/redux/features/cartSlice";
import { InferQueryModel } from "@/lib/db/helpers";
import { RootState } from "@/redux/store";
import Link from "next/link";

type Book = InferQueryModel<
  "bookSchema",
  {
    with: {
      copies: true;
      images: true;
    };
  }
>;

const Page = ({ params }: { params: Record<string, any> }) => {
  const id = params?.id;

  const [bookItem, setBookItem] = useState<Book | null>(null);
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    getBook(id).then((data) => setBookItem(data));
  }, [id]);

  if (!bookItem) return;

  const handleAddToCart = async () => {
    try {
      const bookImages = bookItem?.images?.length ? bookItem.images[0] : null;
      dispatch(
        addItem({
          qty: 1,
          image:bookImages!.url!,
          title: bookItem!.name,
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
        <h2 className="text-2xl font-semibold">{bookItem?.name}</h2>
        <p>
          Copias <span>{bookItem?.copies?.length}</span>
        </p>
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
