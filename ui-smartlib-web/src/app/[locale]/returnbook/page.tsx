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
        <div className="flex rounded-b rounded-md justify-center items-center border-t border-secondary  py-3 px-5 bg-white">
          <Link
            href={"/catalog"}
            className="m-auto border rounded-full font-medium tracking-wider text-sm py-4 px-7 border-primary text-primary bg-transparent"
          >
            {t("rentAnotherBook")}
          </Link>
        </div>
      </section>
    </div>
  );
}
