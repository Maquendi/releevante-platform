import { FetchBookByFtagsVibes } from "@/actions/book-actions";
import BookByIdBanner from "@/components/bookById/BookByIdBanner";
import AddToCartRecomendation from "@/components/vibes/AddToCartRecomendation";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";
import { da } from "@faker-js/faker";
import { QueryClient } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function page({ searchParams }) {
  const queryClient= new QueryClient()
  const data = await queryClient.fetchQuery({
    queryKey:['BOOK_RECOMENDATION',searchParams.toString()],
    queryFn:()=>FetchBookByFtagsVibes(searchParams)
  })
  const t = await getTranslations("recommendationsPage");
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
      <div>
        <VibesStateIndicator/>
      </div>
      <div className="px-10">
        <BookByIdBanner book={data} />
      </div>
      <AddToCartRecomendation book={data}/>
    </div>
  );
}
