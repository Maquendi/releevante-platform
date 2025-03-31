"use client";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/config/i18n/routing";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import NotFoundSearchBooks from "@/components/NotFoundSearchBooks";
import BestSellerSlider from "@/components/BestSellerSlider";
import useSearchBooks from "@/hooks/useSearchBooks";


export default function SearchBooksPage() {

const {searchTerm,books,isPending,handleSetSearchTerm} =useSearchBooks()
  

  return (
    <>
      <Button variant="ghost" className="flex items-center gap-2">
        <Search name="search" className="w-5 h-5" />
        Buscar
      </Button>

      <div
        className={cn(
          "fixed inset-0 bottom-0 z-50 flex flex-col bg-white shadow-lg py-4 ",
          "w-full h-screen overflow-y-auto"
        )}
      >
        <div className="flex items-center justify-between gap-1 border-b border-r-gray-200 pb-3 px-2">
          <div className="px-5">
            <Link href={"/catalog"}>
              <Image
                width={40}
                height={40}
                className="w-[25px] h-[25px]"
                src="/icons/home.svg"
                alt="home icon"
              />
            </Link>
          </div>
          <div  className="relative flex-grow">
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => handleSetSearchTerm(e.target.value)}
              className="pr-10 py-6 w-full px-5 rounded-md transition duration-500"
            />
            <button
              className="absolute focus:bg-gray-500 bg-black text-white rounded-full px-0.5 py-0.5 right-5 top-1/2 -translate-y-1/2"
              onClick={() => handleSetSearchTerm("")}
            >
              <X className="font-bold" size={13} />
            </button>
          </div>
        </div>

        {!searchTerm && isPending ? (
          <div className="grid place-content-center min-h-[80vh]">
            <p>loading...</p>
          </div>
        ) : null}
        {!books?.length && !isPending ? (
          <div className="space-y-10 px-7">
            <NotFoundSearchBooks />
            <Suspense>
              <BestSellerSlider />
            </Suspense>
          </div>
        ) : null}
        <div className="flex flex-col">
          {books?.map((book:any, index:number) => (
            <article key={index}>
              <Link
                href={`/catalog/book/${book?.isbn}?translationId=${book?.translationId}`}
                className="py-3 borde-y cursor-pointer px-3 md:px-6 flex gap-3 items-center justify-between rounded-md border-b border-gray-200 hover:bg-gray-50"
              >
                <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                  <Image
                    src={book?.image}
                    width={100}
                    height={100}
                    className="w-[70px] h-[80px] md:h-[90px] object-cover rounded-md"
                    alt={` ${book?.title} book`}
                  />
                  <div>
                    <h4 className="font-semibold">{book?.title}</h4>
                    <p className="text-gray-400">{book?.author}</p>
                  </div>
                </div>
                <ChevronRight className="size-[25px] md:size-[35px]"  />
              </Link>
            </article>
          ))}
        </div>
      </div>
    
    </>
  );
}
