import ReturnBookList from "@/components/returnbooks/ReturnBookList";
import SimpleNavbar from "@/components/SimpleNavbar";
import { Link } from "@/config/i18n/routing";
import {  useTranslations } from "next-intl";

export default function ReturnBook() {
  const t = useTranslations("returnBook");
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
        <ReturnBookList />
      </section>
    </div>
  );
}
