import {
  FetchAllBookByCategory,
  FetchAllBookCategories,
} from "@/actions/book-actions";
import BookNotFound from "@/components/BookNotFound";
import CatalogSlider from "@/components/CatalogSlider";
import HelpFindBookBanner from "@/components/HelpFindBookBanner";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function CatalogPage({ searchParams }) {
  const categories = await FetchAllBookCategories();
  const selectedCategory = searchParams?.categoryId;
  const books = await FetchAllBookByCategory(selectedCategory);
  const t = await getTranslations("homePage");

  return (
    <div className="space-y-4 pb-5">
      <header className="text-center px-7 bg-background pt-10 bg-white p-3 rounded-b-3xl">
        <div className="flex items-center  justify-between mb-5">
          <div>
            <h1 className="text-left text-4xl font-semibold">{t("title")}</h1>
            <p>{t("subTitle")}</p>
          </div>
          <Image
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
              replace
              scroll={false}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                className={cn(
                  "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                  selectedCategory === category.id &&
                    "bg-primary border-4 border-accent-foreground text-white"
                )}
                href={`/catalog?categoryId=${category.id}`}
                key={category.id}
                replace
                scroll={false}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <section className="space-y-6 px-6">
        {!books?.length && (
          <div className="space-y-5">
            <BookNotFound />
            <HelpFindBookBanner />
          </div>
        )}
        {books?.map(({ subCategory, books }) => {
          return (
            <div
              key={subCategory}
              className="relative bg-[#FFFFFF] space-y-6 pt-6 pb-7 px-2  rounded-xl"
            >
              <div className=" h-[44px] flex items-center ">
                <h4 className="text-xl font-medium  space-x-2 pl-2">
                  <span>{subCategory}</span>
                  <span className="font-light text-secondary-foreground">
                    ({books?.length})
                  </span>
                </h4>
              </div>
              <div>
                <CatalogSlider books={books} />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
