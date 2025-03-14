"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { formatDateByRegion } from "@/lib/utils";
import { Link, useRouter } from "@/config/i18n/routing";
import EmptyRentedBooks from "./EmptyRentedBooks";
import useGetUserTransactions from "@/hooks/useGetUserTransactions";
import { BookTransactionItem, TransactionType } from "@/core/domain/loan.model";
import { SocketEventType, useWebSocketServer } from "@/socket";
import { useDispatch } from "react-redux";
import {
  onBookExchangeSuccess,
  setCurrentItem,
} from "@/redux/features/bookExchangeSlice";
import { useEffect } from "react";

const TIME_REGIONS = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-DO",
} as const;

const CheckinItem = ({
  item,
  onButtonClick,
}: {
  item: BookTransactionItem;
  onButtonClick;
}) => {
  const locale = useLocale();
  const t = useTranslations("returnBook");

  return (
    <article key={item?.isbn} className="relative flex justify-between gap-3">
      <div className="flex gap-5 items-center">
        <figure>
          <Image
            width={300}
            height={200}
            src={item.image}
            alt="book item in cart"
            className="w-[110px] h-[135px] rounded-md object-cover"
          />
        </figure>
        <div className="space-y-1">
          <div className="flex gap-1">
            {item.categories?.map((category) => (
              <p
                key={category.en}
                className="text-xs bg-primary px-2 py-1 rounded-sm font-medium text-white w-fit"
              >
                {category?.[`${locale}`]}
              </p>
            ))}
          </div>
          <h4 className="text-2xl font-medium">{item.title}</h4>
          <p className="text-secondary-foreground">{item.author}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={onButtonClick}
          className="bg-accent first-letter:uppercase text-primary rounded-full px-6 py-6 shadow-sm"
        >
          <span className="first-letter:uppercase">{t("return")}</span>
        </Button>
      </div>
    </article>
  );
};

export default function CheckinItemList() {
  const settings = useAppSelector((state) => state.settings);
  const t = useTranslations("returnBook");
  const locale = useLocale();
  const { bookTransactions, isPending } = useGetUserTransactions();

  const router = useRouter();

  const dispatch = useDispatch();

  const { eventEmitter } = useWebSocketServer(useAppDispatch());

  const onCheckinItemSelected = (
    selected: BookTransactionItem,
    transactionId: string
  ) => {
    const state = {
      ...selected,
      transactionType: TransactionType.RENT,
      transactionId,
    };

    dispatch(setCurrentItem(state));

    const bookTransactionItems = bookTransactions?.rent?.flatMap(
      (rent) => rent.items
    );

    if (bookTransactionItems?.length === 1) {
      dispatch(onBookExchangeSuccess());
    }

    eventEmitter(SocketEventType.checkin, {
      payload: {
        ...state,
        transactionType: TransactionType.RENT,
      },
    });

    router.push("/checkin/deposit");
  };

  return (
    <div className="space-y-5">
      {bookTransactions?.rent?.length === 0 && !isPending ? (
        <EmptyRentedBooks />
      ) : null}
      {bookTransactions?.rent?.map(
        ({ id: transactionId, returnsAt, items: books }) => (
          <div key={returnsAt} className="bg-white pt-5  rounded-md space-y-5">
            <header className="flex justify-between px-4">
              <div className="flex gap-1 items-center text-xl font-medium">
                <p>{t("book")}</p>
                <p className="space-x-1 text-gray-500">
                  (<span>{books.length}</span>
                  {settings?.data && (
                    <>
                      <span>{t("of")}</span>
                      <span>{settings?.data?.maxBooksPerLoan}</span>
                    </>
                  )}
                  )
                </p>
              </div>
              <div className="text-sm font-medium text-gray-500">
                <p className="first-letter:uppercase">
                  <span>{t("returnDate")}</span>:{" "}
                  {returnsAt && (
                    <span>
                      {formatDateByRegion(
                        new Date(returnsAt),
                        TIME_REGIONS?.[locale] || "en-US"
                      )}
                    </span>
                  )}
                </p>
              </div>
            </header>
            <div className="space-y-3 px-4 pb-2">
              {books?.length &&
                books.map((item) => (
                  <CheckinItem
                    key={item.id}
                    item={item}
                    onButtonClick={() =>
                      onCheckinItemSelected(item, transactionId)
                    }
                  />
                ))}
            </div>
            <div className="flex relative   justify-center py-4 border-t border-gray-200 ">
              <Link
                href={"/explore"}
                className="m-auto border rounded-full font-medium tracking-wider text-sm py-4 px-7 border-primary text-primary bg-transparent"
              >
                {books?.length > 0 ? t("rentAnotherBook") : t("rentBook")}
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
}
