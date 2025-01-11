import { FetchBookById } from "@/actions/book-actions";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import dynamic from "next/dynamic";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BookByIdBanner from "@/components/bookById/BookByIdBanner";

const BestSellerSlider = dynamic(
  () => import("@/components/search/BestSellerSlider"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const AddBookToCartBanner = dynamic(
  () => import("@/components/bookById/AddBookToCartBanner"),
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
       <BookByIdBanner book={book}/>
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
            <p>{book?.languages?.map((item) => item.language).join(",")}</p>
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
