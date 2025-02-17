"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link, useRouter } from "@/config/i18n/routing";
import useGetBooks from "@/hooks/useGetCartBooks";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import NavbarV2 from "@/components/NavbarV2";
import RentItemsReview from "@/components/RentItemsReview";
import PurchaseItemsReview from "@/components/PurchaseItemsReview";

export default function ReviewCartPage() {
  const { rentItems, purchaseItems } = useGetBooks();
  const t = useTranslations("reviewMyCart");
  const router = useRouter();

  useEffect(() => {
    if (rentItems.length || purchaseItems.length) return;
    router.push("/catalog");
  }, [rentItems, purchaseItems, router]);

  return (
    <section className="grid grid-rows-[auto_1fr_auto] h-screen ">
      <NavbarV2 prevRouteIntl="myCart" pageIntl="reviewMyCart" />
      <div
        suppressHydrationWarning
        className="overflow-y-auto px-4 py-4 space-y-6"
      >
        <RentItemsReview />
        <PurchaseItemsReview  />
      </div>
      <div className="flex justify-center items-center h-[80px]  bottom-0 right-0 left-0  py-1 px-5 bg-white">
        <Link
          href="/reserved"
          className={cn(
            buttonVariants(),
            "m-auto bg-primary rounded-full py-6 px-7 hover:text-black border-primary"
          )}
        >
          <span className="first-letter:uppercase"> {t("continue")}</span>
        </Link>
      </div>
    </section>
  );
}
