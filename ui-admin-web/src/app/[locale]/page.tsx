import MainSliderBooks from "@/components/MainSlider";
import SelectLanguage from "@/components/SelectLanguage";
import { Link } from "@/config/i18n/routing";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import React, { Suspense } from "react";
import { getQueryClient } from "../getQueryClient";
import {
  FetchAllBookCategories,
  FetchAllBooksByOrg,
} from "@/actions/book-actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["LIBRARY_INVENTORY"],
    queryFn: async () => FetchAllBooksByOrg(),
  });
  queryClient.prefetchQuery({
    queryKey: ["BOOK_CATEGORIES"],
    queryFn: async () => FetchAllBookCategories(),
  });

  return (
    <>
      <nav className="md:hidden flex justify-between px-2 py-2 bg-white">
        <SelectLanguage />
        <figure className="relative w-[140px] h-[50px]">
          <Image
            fill
            className="object-contain"
            src="/images/releevante.svg"
            alt="Releevante Logo"
            sizes="160px"
          />
        </figure>
      </nav>
      <Suspense>
        <div className="md:grid place-content-center min-h-svh grid-cols-2 gap-2 overflow-hidden ">
          <section className="relative flex flex-col md:min-h-svh bg-white">
            <div>
              <figure className="relative hidden custom:block w-[220px] h-[142px] m-auto">
                <Image
                  fill
                  className="object-contain"
                  src="/images/releevante.svg"
                  alt="relevant title image"
                  sizes="300px"
                />
              </figure>
            </div>

            <HydrationBoundary state={dehydrate(queryClient)}>
              <div className="flex-grow-1 min-h-[50%]  relative z-10">
                <MainSliderBooks />
              </div>
            </HydrationBoundary>

            <div className="absolute bottom-0 -left-10 h-[300px] w-full z-0">
              <figure className="relative w-full h-full">
                <Image
                  fill
                  src="/images/releevante-initial.svg"
                  className="object-cover"
                  alt="reelevante initial"
                  sizes="100vw"
                />
              </figure>
            </div>
          </section>

          <section className="grid grid-rows-[auto_auto_1fr] mt-5 px-5 mb-2">
            <div className=" hidden custom:flex  justify-end items-end w-full pb-2">
              <SelectLanguage />
            </div>
            <div>
              <h1 className="text-2xl md:hidden space-x-1 font-medium text-center px-2 mb-2">
                <span className="text-primary">{t("title1")}</span>
                <span>{t("title2")}</span>
                <span className="text-primary">{t("title3")}</span>
                <span>{t("title4")}</span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <article className="md:min-h-[500px] min-w-[200px] flex-1 grid grid-rows-[auto_1fr_auto] px-5 space-y-8 rounded-xl bg-white border border-gray-300 pt-5 pb-8">
                <figure>
                  <Image
                    priority
                    className="w-[130px] h-[150px]"
                    src="/images/love-book.svg"
                    alt="reading a book image"
                    width={150}
                    height={150}
                  />
                </figure>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    {t("showAllBooksTitle")}
                  </h3>
                  <p className="font-thin text-secondary">
                    {t("showAllBooksText")}
                  </p>
                </div>
                <div className="flex">
                  <Link
                    className="bg-primary text-center w-full flex-grow-1 mt-2 px-6 py-4 rounded-full font-medium text-sm text-white"
                    href="/catalog"
                  >
                    {t("showAllBooksBtn")}
                  </Link>
                </div>
              </article>
              <article className="flex-1 md:min-h-[500px] min-w-[200px]  grid grid-rows-[auto_1fr_auto] px-5 space-y-8 rounded-xl bg-white border border-gray-300 pt-5 pb-8">
                <figure>
                  <Image
                    priority
                    className="w-[130px] h-[150px]"
                    src="/images/listening-music-reverse.svg"
                    alt="listeging to music  image"
                    width={150}
                    height={150}
                  />
                </figure>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    {" "}
                    {t("helpFindBookTitle")}
                  </h3>
                  <p className="font-thin">{t("helpFindBookText")}</p>
                </div>
                <div className="flex">
                  <Link
                    className="bg-primary text-center w-full flex-grow-1 mt-2 px-6 py-4 rounded-full font-medium text-sm text-white"
                    href="/vibes/readingvibe"
                  >
                    {t("helpFindBookBtn")}
                  </Link>
                </div>
              </article>
            </div>
          </section>
        </div>
      </Suspense>
    </>
  );
}
