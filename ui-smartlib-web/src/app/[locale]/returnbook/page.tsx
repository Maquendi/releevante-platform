import { FetchUserBooksLoan } from "@/actions/cart-actions";
import ReturnBookList from "@/components/returnbooks/ReturnBookList";
import SimpleNavbar from "@/components/SimpleNavbar";
import { Link } from "@/config/i18n/routing";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function ReturnBook() {
  const t = await getTranslations("returnBook");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["RETURN_BOOKS"],
    queryFn: async () => await FetchUserBooksLoan(),
  });
  return (
    <div className="space-y-12 pb-3">
      <SimpleNavbar href="/catalog" intName="returnBook" intValue="back" />
      <header className="text-center pt-8">
        <div>
          <h1 className="text-3xl font-medium mb-1">{t("yourRentedBooks")}</h1>
          <p className="font-medium text-base">{t("bookToReturn")}</p>
        </div>
      </header>
      <section className="px-5">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ReturnBookList  />
        </HydrationBoundary>
      </section>
    </div>
  );
}
