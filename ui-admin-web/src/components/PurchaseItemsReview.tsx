'use client'

import { Info } from "lucide-react"
import { CartItem } from "./Cartitem"
import { useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { CartItemState } from "@/redux/features/cartSlice";

interface PurchaseItemsReviewProps{
  books:CartItemState[]
}

export default function PurchaseItemsReview({books}:PurchaseItemsReviewProps) {
      const settings = useAppSelector((state) => state.settings);
    const t = useTranslations("reviewMyCart");
    
  return (
    <div>
         {books?.length > 0 && (
          <div className="pt-7 pb-5 px-5 bg-white rounded-xl space-y-5">
            <div className="md:flex space-y-1 justify-between items-center">
              <h3 className="space-x-1 text-xl font-medium flex text-secondary-foreground">
                <p className="space-x-1">
                  <span className="text-black">{t("toBuy")}</span>
                </p>
                <p className="space-x-1">
                  (<span>{books?.length}</span>
                  {settings?.data && (
                    <>
                      <span>{t("of")}</span>
                      <span>{settings?.data?.maxBooksPerLoan}</span>
                    </>
                  )}
                  )
                </p>
              </h3>
              <p className="flex gap-1 items-center bg-[#E1F9FF] text-xs  py-2 rounded-md pl-1 pr-3">
                <Info size={20} className="fill-black text-white" />
                {t("purchaseMsg")}
              </p>
            </div>
            <div className="space-y-4">
              {books.map((item) => (
                <CartItem
                  key={item.isbn}
                  item={item}
                  buttonTextTl="moveToRent"
                  itemType="PURCHASE"
                />
              ))}
            </div>
          </div>
        )}
    </div>
  )
}
