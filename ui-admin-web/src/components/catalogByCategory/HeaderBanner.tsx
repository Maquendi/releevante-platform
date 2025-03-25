'use client'
import Image from "next/image";
import BreadCrumbsPages, { Breadcrumb } from "../BreadCrumbsPages";
import { Button } from "../ui/button";
import MaxWithWrapper from "../MaxWithWrapper";
import useLibraryInventory from "@/hooks/useLibraryInventory";
import { useLocale, useTranslations } from "next-intl";
import { Locales } from "@/types/globals";

const breadcrumb: Breadcrumb[] = [
  {
    label: "Home",    
    path: "/",
  },
  {
    label: "Action:Recommendations",
    path: "/",
    isCurrentPath: true,
  },
];

interface HeaderBannerProp {
  subCategoryId: string;
  categoryId: string;
}

export default  function HeaderBanner({
  categoryId,
  subCategoryId,
}: HeaderBannerProp) {
  const locale = useLocale();
  const t = useTranslations("SeeAllPage");

 const {filterBySubCategory}=useLibraryInventory()
  const {selected} = filterBySubCategory(categoryId,subCategoryId)  

  return (
    <header className="text-center   py-12 bg-background  bg-white  rounded-b-3xl">
      <MaxWithWrapper>
        <div className="px-5 md:px-0 pb-2">
        <BreadCrumbsPages breadCrums={breadcrumb} />
        </div>

        <div className="flex flex-col-reverse  md:flex-row items-center  md:justify-between ">
          <div className="space-y-3  flex flex-col items-center md:items-start">
            <div>
              <h1 className="text-center md:text-left text-2xl md:text-3xl mb-1 font-semibold space-x-2">
                <span>
                  {selected?.subCategory?.[`${locale}` as Locales]}
                </span>
                  {selected?.category && selected?.category?.en?.toLowerCase() !== 'all' && (
                  <>
                    <span>{t("in")}</span>
                    <span className="text-primary">
                      {selected?.category?.[`${locale}` as Locales]}
                    </span>
                  </>
                )}
              </h1>
              <p className="font-light">{t("subTitleBanner")}</p>
            </div>
            <Button className="rounded-3xl text-xs py-4 px-6 tracking-wide hover:text-primary">
              {t("recommendBookBtn")}
            </Button>
          </div>
          <Image
            className="w-[150px] h-[150px]"
            src="/images/love-book.svg"
            alt="reading a book image"
            width={150}
            height={150}
          />
        </div>
      </MaxWithWrapper>
    </header>
  );
}
