"use client";
import BookByIdBanner from "@/components/bookById/BookByIdBanner";
import CatalogSlider from "@/components/CatalogSlider";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";
import useGetRecommendedBook from "@/hooks/useGetRecommendationBook";
import { OtherRecommendedBook, RecommendedBook } from "@/types/book";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";


interface RecommendationState {
    selectedBook: RecommendedBook;
    recomendationCopies: OtherRecommendedBook[];
  }
  
  export default function RecomendationPage({
    searchParams,
  }: {
    searchParams: Record<string, any>;
  }) {
    const t = useTranslations("recommendationsPage");
    const { recomendations } = useGetRecommendedBook(searchParams);
  
    const [recomendationState, setRecomendationState] =
      useState<RecommendationState>();
  
    useEffect(() => {
      if (!recomendations?.recommended?.length) return;
      setRecomendationState({
        selectedBook: recomendations.recommended[0],
        recomendationCopies: recomendations.recommended!,
      });
    }, [recomendations]);

  
    const setSelectedBookByIsbn = (isbn: string) => {
      const newState: any = recomendationState?.recomendationCopies.find(
        (item) => item.isbn === isbn
      );
      setRecomendationState(
        (prev) => ({ ...prev, selectedBook: newState! } as any)
      );
    };
  
    return (
      <div className="space-y-5 pb-4">
        <header className="px-7 bg-white flex items-center pt-3 justify-between  border-b border-gray-200 pb-10">
          <div>
            <h2 className="text-4xl font-semibold space-x-1 mb-3">
              <span>{t("recommendationReadyTitle1")}</span>
              <span className="text-primary">
                {t("recommendationReadyTitle2")}
              </span>
              <span>{t("recommendationReadyTitle3")}</span>
            </h2>
            <p>{t("basedOnResponsesSubtitle")}</p>
          </div>
          <figure>
            <Image
              src="/images/reading-a-book.svg"
              width={150}
              height={150}
              sizes="w-full"
              className="object-cover mr-10"
              alt="inspire others image"
            />
          </figure>
        </header>
        <section className="px-10 space-y-5">
          <div>
            <VibesStateIndicator />
          </div>
          <div>
            <BookByIdBanner
              selectedBook={recomendationState?.selectedBook as any}
              bookTranslations={recomendationState?.recomendationCopies as any}
              setSelectedBookId={(isbn) => setSelectedBookByIsbn(isbn)}
            />
          </div>
          <div className="relative bg-[#FFFFFF] space-y-6 pt-6 pb-7 px-2  rounded-xl mb-10">
            <div className=" h-[44px] flex items-center ">
              <h4 className="text-xl font-medium  space-x-2 pl-2">
                <span>{t("otherRecomendations")}</span>
                <span className="font-light text-secondary-foreground">
                  ({recomendations?.others?.length || 0})
                </span>
              </h4>
            </div>
  
            <div>
              <CatalogSlider
                categoryId="recommendations"
                subCategoryId="all"
                tags={searchParams}
                books={recomendations?.others as any}
              />
            </div>
          </div>
          {/* <AddToCartRecomendation book={selectedBook!} /> */}
        </section>
      </div>
    );
  }
  