"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, LucideIcon, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { FetchAllBookBySearchCriteria } from "@/actions/book-actions";
import { Link } from "@/config/i18n/routing";
import Image from "next/image";

export default function SearchBooks() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["searchResults", searchQuery],
    queryFn: () => FetchAllBookBySearchCriteria(searchQuery),
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  console.log("data", data);

  return (
    <>
      {/* Trigger para abrir el componente */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Search name="search" className="w-5 h-5" />
        Buscar
      </Button>

      {/* Overlay de búsqueda */}
      {isOpen && (
        <div
          className={cn(
            "absolute inset-0 bottom-0 z-50 flex flex-col bg-white shadow-lg p-4",
            "w-full h-screen overflow-y-auto"
          )}
        >
          <div className="flex items-center justify-between mb-4 gap-3">
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
            <div className="relative flex-grow">
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pr-10 py-6 w-full px-5  border border-gray-300 rounded-md transition duration-500 focus:border-red-500 focus:outline-none"
              />
              {/* Botón para cerrar */}
              <button
                className="absolute focus:bg-gray-500 bg-black text-white rounded-full px-0.5 py-0.5 right-5 top-1/2 -translate-y-1/2"
                onClick={() => setIsOpen(false)}
              >
                <X className="font-bold" size={13} />
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="flex flex-col gap-2">
            {isLoading && <p>Cargando...</p>}
            {isError && <p>Error al buscar. Intenta de nuevo.</p>}
            {data?.length ? (
              data.map((item) => (
                <article key={item.id}>
                  <Link
                    href={`/book/${item.id}`}
                    className="py-4 borde-y  flex gap-3 items-center justify-between rounded-md shadow-sm hover:bg-gray-50"
                  >
                    <div className="flex gap-3 items-center">
                      <Image
                        src={item.images?.length ? item.images[0].url : ""}
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
              ))
            ) : (
              <p className="text-gray-500">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
