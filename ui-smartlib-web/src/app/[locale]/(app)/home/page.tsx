import {
  FetchAllBookCategories,
  FetchFtagsBy,
  LoanLibraryInventory,
} from "@/actions/book-actions";
import { Link } from "@/config/i18n/routing";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";

export default async function HomePage() {
  const t = await getTranslations("catalogPage");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["BOOKS_BY_CATEGORIES"],
    queryFn: async () => await LoanLibraryInventory(),
  });
  await queryClient.prefetchQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["READING_VIBE"],
    queryFn: async () => await FetchFtagsBy('reading_vibe'),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="pb-3">
        <header className="text-center px-7 bg-background pt-10 bg-white p-3 rounded-b-3xl">
          <div className="flex items-center  justify-between mb-5">
            <div>
              <h1 className="text-left text-4xl font-semibold">{t("title")}</h1>
              <p>{t("subTitle")}</p>
            </div>
            <Image
              priority
              className="w-[150px] h-[150px]"
              src="/images/reading-a-book.svg"
              alt="reading a book image"
              width={150}
              height={150}
            />
          </div>
        </header>
        <section className="flex gap-5 mt-5 px-5">
          <article className="px-5 space-y-8 rounded-xl bg-white border border-gray-300 pt-5 pb-8">
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
              <h3 className="text-2xl font-semibold">Show me all the books</h3>
              <p className="font-thin">
                Explore our entire library of books! Browse through a vast
                collection of genres, themes, and authors to discover your next
                great read
              </p>
            </div>
            <div className="flex">
              <Link
                className="bg-primary text-center w-full flex-grow-1 mt-2 px-6 py-4 rounded-full font-medium text-sm text-white"
                href="/catalog"
              >
                Browse all the books
              </Link>
            </div>
          </article>
          <article className="px-5 space-y-8 rounded-xl bg-white border border-gray-300 pt-5 pb-8">
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
              <h3 className="text-2xl font-semibold">
                {" "}
                Help me find the right book
              </h3>
              <p className="font-thin">
                Let us guide you! We’ll recommend the perfect book tailored just
                for you, just answer a few quick questions
              </p>
            </div>
            <div className="flex">
              <Link
                className="bg-primary text-center w-full flex-grow-1 mt-2 px-6 py-4 rounded-full font-medium text-sm text-white"
                href="/vibes/readingvibe"
              >
                Browse all the books
              </Link>
            </div>
          </article>
        </section>
      </div>
    </HydrationBoundary>
  );
}
