import { FetchBookById } from "@/actions/book-actions";
import Rating from "@/components/Rating";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";
import SelectLanguage from "@/components/bookById/SelectLanguage";
import AddBookToCartBanner from "@/components/bookById/AddBookToCartBanner";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
const BestSellerSlider = dynamic(
  () => import("@/components/search/BestSellerSlider"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default async function Page({ params }) {
  const queryClient = new QueryClient();
  const bookId = params?.id?.length ? params.id[0] : undefined;
  const book = await queryClient.fetchQuery({
    queryKey: ["BOOK_BY_ID", bookId],
    queryFn: () => FetchBookById(bookId),
  });
  const locate = await getLocale();
  const t = await getTranslations("bookById");

  return (
    <section className="relative px-7 mt-7 space-y-10">
      <div className="flex gap-5 p-3 rounded-md m-auto bg-white px-5 py-10">
        <div>
          <Image
            src={book?.images?.length ? book.images[0].url : ""}
            width={300}
            height={300}
            className="w-[270px] h-[300px] rounded-xl object-cover bg-gray-200"
            alt={`${book?.bookTitle} book image`}
          />
        </div>
        <div className="space-y-4 flex-1">
          <div className="flex gap-2 mb-5">
            <p className="bg-primary py-1 px-2 rounded-sm text-white text-sm font-medium">
              <span>{book.category?.[`${locate}Category`]}</span>
            </p>
            <p className="bg-secondary py-1 px-2 rounded-sm  text-sm font-medium">
              Semi-used
            </p>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-semibold">{book?.bookTitle}</h2>
            <p className="font-medium text-2xl text-secondary-foreground">
              {book?.author}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Rating rating={book?.rating || 0} />
            <p className="text-secondary-foreground text-sm">{book?.rating}</p>
            <p className="text-secondary-foreground text-sm">
              ({book?.votes} votes)
            </p>
          </div>
          <div className="border-t border-secondary pt-3">
            <h4 className="font-medium mb-1">{t("selectLanguage")}</h4>
            <SelectLanguage booklanguages={book?.bookLanguages} />
          </div>
        </div>
      </div>
      <div className="border-b border-secondary-foreground py-4">
        <h3 className="text-xl font-semibold mb-2">{t("bookSummary")}</h3>
        <p className=" font-light">{book?.[`${locate}Description`] || ""}</p>
      </div>
      <div className="border-b border-secondary-foreground py-4">
        <h3 className="text-xl font-semibold mb-2">{t("bookDetail")}</h3>
        <div className="grid grid-cols-3 grid-rows-2 gap-3">
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {" "}
              {t("printLength")}
            </h4>
            <p>{book?.printLength}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("publicationDate")}
            </h4>
            <p>{book?.publicationDate}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("dimensions")}
            </h4>
            <p>{book?.dimensions}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("language")}
            </h4>
            <p>{book?.bookLanguages?.map((item) => item.language).join(",")}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">
              {t("publisher")}
            </h4>
            <p>{book?.publisher}</p>
          </div>
          <div className="bg-white py-5 px-4 rounded-md font-light">
            <h4 className="text-secondary-foreground text-sm mb-2">ISBN-10</h4>
            <p>{book?.id}</p>
          </div>
        </div>
      </div>
      <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BestSellerSlider />
        </HydrationBoundary>
      </div>
      <AddBookToCartBanner productId={bookId} />
    </section>
  );
}
