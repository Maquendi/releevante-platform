"use client";
import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Link } from "@/config/i18n/routing";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { FetchAllBookBySearchCriteria } from "@/actions/book-actions";
import { useDebounce } from "use-debounce";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import NotFoundSearchBooks from "@/components/search/NotFound";
import BestSellerSlider from "@/components/search/BestSellerSlider";


export default function SearchBooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryValue]=useDebounce(searchQuery,400)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  const { data, isPending,isFetching } = useQuery({
    queryKey: ["searchResults", queryValue],
    queryFn: () => FetchAllBookBySearchCriteria(queryValue),
    refetchOnWindowFocus:false
  });

  const handleInputChange = (val:string) => {
    setSearchQuery(val);
  };

  const handleInputFocus = () => {
    if(isKeyboardVisible)return
    setIsKeyboardVisible(true)
  };


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
        <div  className="flex items-center justify-between gap-3 border-b border-secondary pb-3 px-5">
          <div className="px-5">
            <Link href={"/catalog"}>
              <Image
                width={40}
                height={40}
                className="w-[30px] h-[30px]"
                src="/icons/home.svg"
                alt="home icon"
              />
            </Link>
          </div>
          <div onClick={handleInputFocus} className="relative flex-grow">
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              className="pr-10 py-6 w-full px-5 rounded-md transition duration-500"
            />
            <button
              className="absolute focus:bg-gray-500 bg-black text-white rounded-full px-0.5 py-0.5 right-5 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="font-bold" size={13} />
            </button>
          </div>
        </div>

        {isPending && queryValue? <div className="grid place-content-center min-h-[80vh]">
          <p>loading...</p>
        </div>:null}
        {!data?.length && !isFetching? <div className="space-y-10 px-7">
          <NotFoundSearchBooks/>
           <Suspense>
             <BestSellerSlider/>
           </Suspense>
        </div> : null}
        <div className="flex flex-col">
          {data?.map((item) => (
            <article key={item.id}>
              <Link
                href={`/catalog/book/${item.correlationId}`}
                className="py-3 borde-y cursor-pointer px-6 flex gap-3 items-center justify-between rounded-md border-b border-secondary hover:bg-gray-50"
              >
                <div className="flex gap-3 items-center ">
                  <Image
                    src={item.image}
                    width={100}
                    height={100}
                    className="w-[70px] h-[90px] object-cover rounded-md"
                    alt={` ${item.bookTitle} book`}
                  />
                  <div>
                    <h4 className="font-semibold">{item.bookTitle}</h4>
                    <p>{item.author}</p>
                  </div>
                </div>
                <ChevronRight size={40} />
              </Link>
            </article>
          ))}
        </div>
      </div>
      <VirtualKeyboard
        setInputText={setSearchQuery}
        open={isKeyboardVisible}
        setOpen={setIsKeyboardVisible}
        state={searchQuery}
      />
    </>
  );
}
