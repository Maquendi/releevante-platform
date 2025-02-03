import { FetchAllBookCategories } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function BookNotFound() {
  const searchParams = useSearchParams();
  const t = useTranslations("catalogPage");
  const locale = useLocale();
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => await FetchAllBookCategories(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const categoryId = searchParams?.get("categoryId");

  const currentCategory = useMemo(() => {
    return categories?.filter((item) => item.id === categoryId);
  }, [categories, categoryId]);

  return (
    <div className="grid place-content-center gap-1 bg-white py-5 rounded-2xl">
      <figure>
        <Image
          src="/images/book-notfound.jpg"
          width={150}
          height={150}
          className="w-[150px] h-auto m-auto"
          alt="book not found image"
        />
      </figure>
      <p className="space-x-1">
        <span>{t('notFound1')}.</span>
        {currentCategory?.length  && (
          <span className="text-primary font-medium">{currentCategory?.[0][`${locale}TagValue`]}</span>
        )}
        <span className="text-primary font-medium">{t('books')}</span>
        <span>{t('notFound2')}</span>
        </p>
    </div>
  );
}
