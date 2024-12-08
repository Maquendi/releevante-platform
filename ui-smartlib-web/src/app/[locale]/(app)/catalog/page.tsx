import {
  FetchAllBookByCategory,
  FetchAllBookCategories,
} from "@/actions/book-actions";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import BookNotFound from "@/components/BookNotFound";
import CatalogSliderItem from "@/components/catalogByCategory/CatalogSliderItem";



export default async function CatalogPage({ searchParams }) {
  const categories = await FetchAllBookCategories();
  const selectedCategory = searchParams?.categoryId;
  const queryClient = new QueryClient();
  const booksByCategory = await queryClient.fetchQuery({
    queryKey: ["BOOKS_BY_CATEGORIES", selectedCategory],
    queryFn: () => FetchAllBookByCategory(selectedCategory),
  });
  const t = await getTranslations("homePage");
  const locale = await getLocale();

  return (
    <div className="space-y-4 pb-5">
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
        <div>
          <h3 className="mb-2 text-secondary-foreground uppercase font-medium text-sm ">
            {t("selectCategory")}
          </h3>
          <div className="flex gap-2 items-center text-sm font-medium overflow-x-scroll no-scrollbar snap-x snap-mandatory select-none whitespace-nowrap">
            <Link
              className={cn(
                "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                !selectedCategory &&
                  "bg-primary border-4 border-accent-foreground text-white"
              )}
              href={`/catalog`}
              scroll={false}
            >
              All
            </Link>
            {categories?.map((category) => (
              <Link
                className={cn(
                  "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                  selectedCategory === category?.id &&
                    "bg-primary border-4 border-accent-foreground text-white"
                )}
                href={`/catalog?categoryId=${category?.id}`}
                key={category?.id}
              >
                {category[`${locale}Name`] || ""}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <section className="space-y-6 px-6">
    {!booksByCategory?.length && (
      <div className="space-y-5">
        <BookNotFound />
        <HelpFindBookBanner />
      </div>
    )}
    <HydrationBoundary state={dehydrate(queryClient)}>
      {booksByCategory?.map((item, index) => (
        <CatalogSliderItem key={index} {...item} />
      ))}{" "}
    </HydrationBoundary>
  </section> 
    </div>
  );
}
