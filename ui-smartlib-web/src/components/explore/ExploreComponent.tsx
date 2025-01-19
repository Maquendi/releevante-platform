"use client";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import BookNotFound from "../BookNotFound";
import HelpFindBookBanner from "../HelpFindBookBanner";
import SubCategoryComponent from "./subcategory/SubCategoryComponent";
import useLibraryInventory, {
  filterLibraryInventory,
} from "@/hooks/useLibraryInventory";
import { useEffect, useState } from "react";
import { CategoryGraph } from "@/book/domain/models";

interface CatalogPageProps {
  categoryId: string;
}

export default function ExploreComponent() {
  const t = useTranslations("catalogPage");
  const locale = useLocale();
  const { isPending, libraryInventory } = useLibraryInventory();
  const [categories, setCategories] = useState<CategoryGraph[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryGraph>();
  const [categoryAll, setCategoryAll] = useState<CategoryGraph>();

  useEffect(() => {
    setCategories(libraryInventory?.categories || []);
    const categoyAll = filterLibraryInventory(libraryInventory);

    setCategoryAll(categoyAll);
    setSelectedCategory(categoryAll);
  }, [categories]);

  const onSelected = (selectedCategory: CategoryGraph) => {
    setSelectedCategory(selectedCategory);
  };

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
            <button
              className={cn(
                "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                !selectedCategory?.id &&
                  "bg-primary border-4 border-accent-foreground text-white"
              )}
              onClick={() => onSelected(categoryAll!)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                onClick={() => onSelected(category)}
                className={cn(
                  "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
                  selectedCategory?.id === category?.id &&
                    "bg-primary border-4 border-accent-foreground text-white"
                )}
                key={category?.id}
              >
                {category?.[`${locale}`] || ""}
              </button>
            ))}
          </div>
        </div>
      </header>
      <section className="space-y-6 px-6">
        {!selectedCategory?.subCategories?.length && !isPending ? (
          <div className="space-y-5">
            <BookNotFound />
            <HelpFindBookBanner />
          </div>
        ) : null}
        {selectedCategory?.subCategories?.map((item, index) => (
          <SubCategoryComponent
            key={index}
            categoryId={selectedCategory?.id}
            subCategory={item}
          />
        ))}{" "}
      </section>
    </div>
  );
}
