"use client";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import BookNotFound from "../BookNotFound";
import HelpFindBookBanner from "../HelpFindBookBanner";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useLibraryInventory from "@/hooks/useLibraryInventory";
import CatalogSliderItem from "./CatalogSliderItem";
import MaxWithWrapper from "../MaxWithWrapper";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { Locales } from "@/types/globals";


export default function ExploreComponent() {
  const t = useTranslations("catalogPage");
  const locale = useLocale();
  const {categories, subCategoryBooksFrom } = useLibraryInventory();

  const ref = useRef<HTMLDivElement | null>(null);

  const scrollStep = 100;

  const scroll = () => {
    if (ref.current) {
      const container = ref.current;
      const isAtEnd =
        container.scrollLeft + container.clientWidth >= container.scrollWidth;

      if (!isAtEnd) {
        container.scrollTo({
          left: container.scrollLeft + scrollStep,
          behavior: "smooth",
        });
      }
    }
  }

  return (
    <>
      <div className="">
        <Tabs className={`w-full`}>
          <div className="bg-white pb-3 rounded-b-3xl text-sm font-medium  mb-7">
            <MaxWithWrapper>
              <h3 className="mb-2 text-secondary-foreground uppercase font-medium text-sm text-center ">
                {t("selectCategory")}
              </h3>
              <TabList className="relative">
                <div
                  ref={ref}
                  className="flex overflow-x-scroll scroll-hidden snap-x snap-start min-h-[45px] "
                >
                  {categories?.map((category, index) => (
                    <Tab
                      key={index}
                      className={cn(
                        "flex-none border px-6 pt-3 pb-2 mx-1 border-gray-500 outline-none rounded-full snap-start snap-x snap-mandatory select-none whitespace-nowrap"
                      )}
                      selectedClassName="bg-primary border-4 !border-accent-dark   text-white text-center"
                    >
                      {category?.[`${locale}` as Locales]}
                    </Tab>
                  ))}
                  <button
                    onClick={scroll}
                    className="absolute bg-white -right-5 z-50 -top-1 p-4 rounded-full shadow-xl"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute right-2 top-0 z-[99] bottom-0 w-28 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

                </div>
              </TabList>
            </MaxWithWrapper>
          </div>

          <MaxWithWrapper>
            {categories?.map((category, index) => (
              <TabPanel key={index}>
                <section className="space-y-6 ">
                  {category?.subCategoryRelations?.map((item) => {
                    const {books,subCategory} = subCategoryBooksFrom(item);
                    if(!books?.length){
                      return (
                        <div key={item.id} className="space-y-5">
                        <BookNotFound />
                        <HelpFindBookBanner />
                      </div>
                      )
                    }
                    return (
                      <CatalogSliderItem
                        key={item?.id}
                        categoryId={category?.id}
                        subCategory={subCategory!}
                        books={books}
                      />
                    );
                  })}
                </section>
              </TabPanel>
            ))}
          </MaxWithWrapper>
        </Tabs>
      </div>
    </>
  );
}
