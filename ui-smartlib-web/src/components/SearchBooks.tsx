"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import {
  FetchAllBookByCategory,
  FetchAllBookBySearchCriteria,
} from "@/actions/book-actions";
import { Link } from "@/config/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CatalogSliderItem from "./catalogByCategory/CatalogSliderItem";

const useCategoryBooks = () => {
  return useQuery({
    queryKey: ["BOOKS_BY_CATEGORIES"], // queryKey sin parámetros dinámicos
    queryFn: () => FetchAllBookByCategory(""),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
};


function NotFoundSearchBooks() {
  const t = useTranslations("SearchBookPage");
  const { data: categoryBooks } = useCategoryBooks();

  const bestSeller = useMemo(() => {
    return categoryBooks?.find(
      (item) =>
        item.subCategory.enSubCategoryName.toLocaleLowerCase() === "best sellers"
    );
  }, [categoryBooks]);

  return (
    <div className="flex flex-col text-center mt-12 px-8 gap-10">
      <div>
        <h2 className="text-3xl font-medium">{t("bookNotFound")}</h2>
        <p className="font-light">{t("tryTheseBooks")}</p>
      </div>
      {bestSeller && (
        <div className="border border-t border-b rounded-2xl border-gray-200">
          <CatalogSliderItem {...bestSeller!} />
        </div>
      )}
    </div>
  );
}




export default function SearchBooks() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");



  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["searchResults", searchQuery],
    queryFn: () => FetchAllBookBySearchCriteria(searchQuery),
    enabled: isOpen,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
            " fixed inset-0 bottom-0 z-50 flex flex-col bg-white shadow-lg py-4 ",
            "w-full h-screen overflow-y-auto"
          )}
        >
          <div className="flex items-center justify-between  gap-3 border-b border-secondary pb-3 px-5">
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
                className="pr-10  py-6 w-full px-5  rounded-md transition duration-500  "
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
          <div className="flex flex-col  ">
            {isPending && <p>Cargando...</p>}
            {isError && <p>Error al buscar. Intenta de nuevo.</p>}
            {data?.length ? (
              data.map((item) => (
                <article key={item.id}>
                  <Link
                    href={`/book/${item.id}`}
                    className="py-3  borde-y cursor-pointer  px-6 flex gap-3 items-center justify-between rounded-md border-b border-secondary hover:bg-gray-50"
                  >
                    <div className="flex gap-3 items-center ">
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
              <NotFoundSearchBooks />
            )}
          </div>
        </div>
      )}
    </>
  );
}
