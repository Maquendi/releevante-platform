"use client";
import { loadBookDetail } from "@/actions/book-actions";
import { IBookDetail } from "@/book/domain/models";
import BookByIdBannerV2 from "@/components/bookById/BookByIdBannerV2";
import SubCategorySlider from "@/components/explore/subcategory/SubCategorySlider";
import AddToCartRecomendation from "@/components/vibes/AddToCartRecomendation";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";

import useGetRecomendationBooksV2 from "@/hooks/useGetRecomendationBooksV2";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RecomendationPage({ searchParams }) {
  const t = useTranslations("recommendationsPage");
  const { recomendations } = useGetRecomendationBooksV2({
    searchParams,
  });

  const [selectedBook, setSelectedBook] = useState<IBookDetail>();

  const [recomendedCopies, setRecomendedCopies] = useState<IBookDetail[]>([]);

  useEffect(() => {
    setSelectedBook(recomendations?.recommended);
    setRecomendedCopies(recomendations?.translations!);
  }, [recomendations]);

  const setSelectedBookByIsbn = (isbn: string) => {
    setSelectedBook(recomendedCopies.find((item) => item.isbn === isbn));
  };

  return (
    <div className="space-y-5">
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
          <BookByIdBannerV2
            selectedBook={selectedBook}
            relatedBooks={recomendedCopies}
            setSelectedBook={(isbn) => setSelectedBookByIsbn(isbn)}
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
            <SubCategorySlider
              categoryId="recommendations"
              subCategory={{
                id: "recommendations",
                books: recomendations?.others || [],
              }}
            />
          </div>
        </div>
        <AddToCartRecomendation book={selectedBook!} />
      </section>
    </div>
  );
}
