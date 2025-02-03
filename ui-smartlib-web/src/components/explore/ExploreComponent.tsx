"use client";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import BookNotFound from "../BookNotFound";
import HelpFindBookBanner from "../HelpFindBookBanner";
import { useEffect, useState } from "react";
import { CategoryV2 } from "@/book/domain/models";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import SubCategoryComponent from "./subcategory/SubCategoryComponent";
import useLibraryInventory from "@/hooks/useLibraryInventory";

export default function ExploreComponent() {
  const t = useTranslations("catalogPage");
  const locale = useLocale();
  const [categories, setCategories] = useState<CategoryV2[]>([]);

  const { libraryInventory, isPending, subCategoryFrom } =
  useLibraryInventory();

  useEffect(() => {
    setCategories(libraryInventory!.categories);
  }, [libraryInventory]);

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
          <div className="flex gap-2 items-center text-sm font-medium snap-x snap-mandatory select-none whitespace-nowrap">
            <Tabs className={`w-full`}>
              <TabList className={`overflow-x-scroll no-scrollbar flex`}>
                {categories.map((category, index) => (
                  <Tab
                    key={index}
                    className={cn(
                      "flex-none border px-6 pt-3 pb-2 mx-1 border-gray-500 rounded-full snap-start"
                    )}
                    selectedClassName="bg-primary border-4 border-accent-foreground text-white"
                  >
                    {category?.[`${locale}`]}
                  </Tab>
                ))}
              </TabList>

              {categories.map((category, index) => (
                <TabPanel key={index}>
                  <section className="space-y-6 px-6">
                    {!category?.subCategoryRelations?.length && !isPending ? (
                      <div className="space-y-5">
                        <BookNotFound />
                        <HelpFindBookBanner />
                      </div>
                    ) : null}
                    {category?.subCategoryRelations?.map((item, index) => (
                      <SubCategoryComponent
                        key={index}
                        categoryId={category?.id}
                        subCategory={subCategoryFrom(item)}
                      />
                    ))}{" "}
                  </section>
                </TabPanel>
              ))}
            </Tabs>
          </div>
        </div>
      </header>
    </div>
  );
}
