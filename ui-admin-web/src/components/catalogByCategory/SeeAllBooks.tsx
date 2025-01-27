import {
  FetchBookByCategory,
  FetchAllBookCategories,
} from "@/actions/book-actions";
import BookItem from "./BookItem";
import { getLocale, getTranslations } from "next-intl/server";
import MaxWithWrapper from "../MaxWithWrapper";

interface SeeAllBooksPros {
  subCategoryId: string;
  categoryId: string;
}

export default async function SeeAllBooks({
  subCategoryId,
  categoryId,
}: SeeAllBooksPros) {
  const locale = await getLocale();
  const t= await getTranslations('SeeAllPage')
  const categories = await FetchAllBookCategories();
  const booksByCategory = await FetchBookByCategory();

  const bookByCategory = booksByCategory?.find(
    (item) => item.subCategory.id === subCategoryId
  );

  const currentCategory = categories?.find(
    (item: any) => item.id === categoryId
  );

  return (
   <MaxWithWrapper>
     <div className="min-h-[250px]">
      <h2 className="text-xl font-medium space-x-2 mb-5">
        {categoryId && (
          <span>{currentCategory?.[`${locale}CategoryName`]}</span>
        ) }
        <span className=" capitalize">{t('books')}</span>
        <span className="text-secondary-foreground font-light">
          ({bookByCategory?.books?.length || 0})
        </span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] place-items-center md:place-items-start  gap-2 md:gap-5">
        {bookByCategory?.books.map((book: any) => (
          <BookItem
            className="text-xs"
            key={book.isbn}
            width={140}
            height={180}
            book={book}
          />
        ))}
      </div>
    </div>
   </MaxWithWrapper>
  );
}
