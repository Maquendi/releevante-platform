import Image from "next/image";
import React from "react";
import { getTranslations } from "next-intl/server";
import {
  FetchAllBookCategories,
  FetchAllBooksByOrg,
} from "@/actions/book-actions";
import MaxWithWrapper from "@/components/MaxWithWrapper";
import { Button } from "@/components/ui/button";
import ExploreComponent from "@/components/catalogByCategory/ExploreComponent";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";

export default async function CatalogPage() {
  const t = await getTranslations("catalogPage");
  const queryClient = getQueryClient()
  queryClient.ensureQueryData({
    queryKey: ["LIBRARY_INVENTORY"],
    queryFn: FetchAllBooksByOrg,
  })

  queryClient.ensureQueryData({
    queryKey: ["BOOK_CATEGORIES"],
    queryFn: FetchAllBookCategories,
  })

  return (
    <div className="pb-5">
      <header className="text-center  bg-background pt-10 bg-white p-3">
        <MaxWithWrapper>
          <div className="grid grid-rows-2 place-items-center md:flex flex-row-reverse gap-y-2 items-center  justify-center md:justify-between mb-5">
            <Image
              priority
              className="w-[150px] h-[150px]"
              src="/images/reading-a-book.svg"
              alt="reading a book image"
              width={150}
              height={150}
            />
            <div className="flex flex-col  items-center md:items-start gap-y-2">
              <h1 className="text-left text-3xl md:text-4xl font-semibold">
                {t("title")}
              </h1>
              <p>{t("subTitle")}</p>
              <Button className="w-fit rounded-3xl text-sm px-6 py-5 hover:text-primary">
                {t('recommendBookBtn')}
              </Button>
            </div>
          </div>
        </MaxWithWrapper>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExploreComponent/>
      </HydrationBoundary>
    </div>
  );
}
