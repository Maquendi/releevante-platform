import {
  FetchAllBookCategories,
  FetchBookByCategory,
} from "@/actions/book-actions";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import BreadCrumbsPages, { Breadcrumb } from "../BreadCrumbsPages";
import { Button } from "../ui/button";
import MaxWithWrapper from "../MaxWithWrapper";

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

export default async function HeaderBanner({
  categoryId,
  subCategoryId,
}: HeaderBannerProp) {
  const locale = await getLocale();
  const t = await getTranslations("SeeAllPage");

  const categories = await FetchAllBookCategories();
  const booksByCategory = await FetchBookByCategory();

  const [bookByCategoryFiltered] = booksByCategory?.filter(
    (item) => item.subCategory.id === subCategoryId
  );

  const currentCategory = categories?.find((item) => item.id === categoryId);

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
                  {bookByCategoryFiltered?.subCategory[`${locale}TagValue`]}
                </span>
                {categoryId && (
                  <>
                    <span>{t("in")}</span>
                    <span className="text-primary">
                      {currentCategory?.[`${locale}TagValue`]}
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
