'use client'
import React, { useMemo } from 'react'
import { CartItem } from './Cartitem'
import { Link } from '@/config/i18n/routing'
import { formatDateByRegion } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl';
import { useAppSelector } from '@/redux/hooks';
import { CartItemState } from '@/redux/features/cartSlice'

interface RentItemsReviewProps{
    isReservedBooks?:boolean,
    books:CartItemState[]

}
export default function RentItemsReview({isReservedBooks,books}:RentItemsReviewProps) {
const translationPage = useMemo(()=>{
  return isReservedBooks ? 'reservedBooks':'reviewMyCart'
},[isReservedBooks])
const t = useTranslations(translationPage);
  const settings = useAppSelector((state) => state.settings);

  const locale = useLocale();  return (
    <div>
        {books?.length > 0 && (
          <div className="pt-7 grid bg-white rounded-xl space-y-5">
            <div className="px-4 space-y-1 md:flex justify-between">
              <h3 className="space-x-1 text-xl font-medium flex">
                <p className="space-x-1">
                  <span className="text-black">{t("readInHotel")} </span>
                </p>
                <p className="space-x-1 text-secondary-foreground">
                  (<span>{books.length}</span>
                  {settings?.data && (
                    <>
                      <span>{t("of")}</span>
                      <span>{settings?.data?.maxBooksPerLoan}</span>
                    </>
                  )}
                  )
                </p>
              </h3>
              <h3 className="space-x-1 first-letter:uppercase text-gray-500 text-sm md:text-base">
                <span>{t("returnDate")}:</span>
                <span>{formatDateByRegion(new Date(), locale as any)}</span>
              </h3>
            </div>
            <div className="px-4 space-y-4">
              {books.map((item) => (
                <CartItem
                  key={item.isbn}
                  item={item}
                  buttonTextTl="moveToBuy"
                  itemType="RENT"
                />
              ))}
            </div>
            <div className="flex justify-center items-center border-t border-gray-200  py-3 px-5 bg-white">
              <Link
                href={"/catalog"}
                className="m-auto border rounded-full font-medium tracking-wider text-sm py-4 px-7 border-primary text-primary bg-transparent"
              >
                {isReservedBooks? t("reserveAnotherBook"):t("rentAnotherBook")}
              </Link>
            </div>
          </div>
        )}
    </div>
  )
}
