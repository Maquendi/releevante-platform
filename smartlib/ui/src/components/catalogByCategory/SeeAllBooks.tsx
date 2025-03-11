"use client";

import { useEffect, useState } from "react";
import BookItem from "./BookItem";
import { useLocale, useTranslations } from "next-intl";
import { Category, PartialBook } from "@/book/domain/models";

function SeeAllBooks({ category }: { category: Category }) {
  const locale = useLocale();
  const t = useTranslations("SeeAllPage");

  const [books, setBooks] = useState<PartialBook[]>([]);

  const { id: categoryId, subCategories } = category || {};

  useEffect(() => {
    setBooks(subCategories?.map((sub) => sub.books).flat());
  }, [subCategories]);

  return (
    <div className="min-h-[250px]">
      <h2 className="text-xl font-medium space-x-2 mb-5">
        {categoryId && <span>{category?.[`${locale}`]}</span>}
        <span className=" first-letter:uppercase capitalize">{t("books")}</span>
        <span className="text-secondary-foreground font-light">
          ({books?.length})
        </span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5">
        {books?.map((book, index) => (
          <BookItem
            className="text-xs"
            key={index}
            width={140}
            height={180}
            book={book}
          />
        ))}
      </div>
    </div>
  );
}

export default SeeAllBooks;
