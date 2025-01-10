import { FetchBookByFtagsVibes } from "@/actions/book-actions";
import BookByIdBanner from "@/components/bookById/BookByIdBanner";
import CatalogSlider from "@/components/CatalogSlider";
import AddToCartRecomendation from "@/components/vibes/AddToCartRecomendation";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";
import { QueryClient } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function page({ searchParams }) {
  const queryClient = new QueryClient();
  const data = await queryClient.fetchQuery({
    queryKey: ["BOOK_RECOMENDATION", searchParams.toString()],
    queryFn: () => FetchBookByFtagsVibes(searchParams),
  });
  const t = await getTranslations("recommendationsPage");

  const currentBook = data?.length ? data[0] : null;
  const recomendationBooks = data.slice(1, -1);
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
        <BookByIdBanner book={currentBook!} />
      </div>
      <div className="relative bg-[#FFFFFF] space-y-6 pt-6 pb-7 px-2  rounded-xl mb-10">
        <div className=" h-[44px] flex items-center ">
          <h4 className="text-xl font-medium  space-x-2 pl-2">
            <span>Recomendations</span>
            <span className="font-light text-secondary-foreground">
              ({recomendationBooks?.length || 0})
            </span>
          </h4>
        </div>
        <div>
          <CatalogSlider subCategoryId={""} books={recomendationBooks as any} />
        </div>
      </div>
      <AddToCartRecomendation book={currentBook!} />
     </section>
     </div>
  );
}
