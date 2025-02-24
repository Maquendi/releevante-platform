"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link, useRouter } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import RentItemsReview from "@/components/RentItemsReview";
import PurchaseItemsReview from "@/components/PurchaseItemsReview";
import useGetCartBooks from "@/hooks/useGetCartBooks";

export default function ReviewCartPage() {
  const t = useTranslations("reviewMyCart");
  const router = useRouter();
  const {rentItems,purchaseItems}=useGetCartBooks()

  useEffect(() => {
    if (rentItems.length || purchaseItems.length) return;
    router.push("/catalog");
  }, [rentItems, purchaseItems, router]);

  return (
    <section className="grid grid-rows-[1fr_auto] h-[91.5dvh] ">
      <div
        suppressHydrationWarning
        className="overflow-y-auto px-4 py-4 space-y-6"
      >
        <RentItemsReview books={rentItems} />
        <PurchaseItemsReview books={purchaseItems}  />
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
