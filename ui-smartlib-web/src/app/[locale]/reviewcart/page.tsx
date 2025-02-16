"use client";

import SimpleNavbar from "@/components/SimpleNavbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useRouter } from "@/config/i18n/routing";
import { TransactionType } from "@/core/domain/loan.model";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { useCheckout } from "@/hooks/useCheckout";
import useGetBooks from "@/hooks/useGetBooks";
import { cn } from "@/lib/utils";
import { removeItem, updateItem } from "@/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";

const CartItem = ({
  item,
  buttonTextTl,
  onMoveButtonClick,
  itemForRent,
  onTrashClick,
}) => {
  const locale = useLocale();
  const t = useTranslations("reviewMyCart");

  const { maxBookAllowed, booksInCartCount, hasEnoughCopies, canBeSold } =
    useAddBookToCart(item);

  const moveButtonDisabled = (() => {
    if (itemForRent) {
      return (
        booksInCartCount.purchaseItemsCount >= maxBookAllowed! || !canBeSold
      );
    }
    return (
      booksInCartCount.rentItemsCount >= maxBookAllowed! || !hasEnoughCopies
    );
  })();

  return (
    <article key={item?.isbn} className="relative flex justify-between gap-3">
      <div className="flex gap-5 items-center">
        <figure>
          <Image
            width={300}
            height={200}
            src={item?.image || ""}
            alt="book item in cart"
            className="w-[110px] h-[135px] rounded-md object-cover"
          />
        </figure>
        <div className="space-y-1">
          <div className="flex gap-1">
            {item.categories?.map((category) => (
              <p
                key={category.enTagValue}
                className="text-xs bg-primary px-2 py-1 rounded-sm font-medium text-white w-fit"
              >
                {category?.[`${locale}TagValue`]}
              </p>
            ))}
          </div>
          <h4 className="text-2xl font-medium">{item.title}</h4>
          <p className="text-secondary-foreground">{item.author}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          disabled={moveButtonDisabled}
          onClick={() => onMoveButtonClick(item)}
          className="bg-accent text-primary rounded-full px-6 py-6 shadow-sm"
        >
          {t(buttonTextTl)}
        </Button>
        <button onClick={() => onTrashClick(item)}>
          <Image
            width={40}
            height={40}
            src="/icons/trash.svg"
            alt="Remove book from cart"
            className="w-[30px] h-[30px] rounded-md object-cover"
          />
        </button>
      </div>
    </article>
  );
};

export default function ReviewCartPage() {
  const { rentItems, purchaseItems } = useGetBooks();
  const settings = useAppSelector((state) => state.settings);
  const t = useTranslations("cart");
  const tReviewCart = useTranslations("reviewMyCart");

  const { transactionCheckout } = useCheckout();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleMoveToBuy = (isbn: string) => {
    dispatch(updateItem({ isbn, transactionType: TransactionType.PURCHASE }));
  };

  const handleMoveToRent = (isbn: string) => {
    dispatch(updateItem({ isbn, transactionType: TransactionType.RENT }));
  };

  const handleRemoveItem = (isbn: string) => {
    dispatch(removeItem({ isbn }));
  };

  useEffect(() => {
    if (rentItems.length || purchaseItems.length) return;
    router.push("/explore");
  }, [rentItems, purchaseItems, router]);

  return (
    <section className="grid grid-rows-[auto_1fr,auto] h-screen">
      <SimpleNavbar href="/explore" intName="reviewMyCart" intValue="myCart" />
      <div
        suppressHydrationWarning
        className="overflow-y-auto px-4 py-4 space-y-6"
      >
        {rentItems?.length > 0 && (
          <div className="pt-7 grid bg-white rounded-xl space-y-5">
            <div className="px-4">
              <h3 className="space-x-1 font-medium flex">
                <p className="space-x-1">
                  <span className="capitalize">{t("to")}</span>
                  <span className="text-black">{t("rent")} </span>
                </p>
                <p className="space-x-1 text-secondary-foreground">
                  (<span>{rentItems.length}</span>
                  {settings?.data && (
                    <>
                      <span>{t("of")}</span>
                      <span>{settings?.data?.maxBooksPerLoan}</span>
                    </>
                  )}
                  )
                </p>
              </h3>
            </div>
            <div className="px-4 space-y-4">
              {rentItems.map((item) => (
                <CartItem
                  key={item.isbn}
                  item={item}
                  buttonTextTl="moveToBuy"
                  itemForRent={true}
                  onMoveButtonClick={() => handleMoveToBuy(item.isbn)}
                  onTrashClick={() => handleRemoveItem(item.isbn)}
                />
              ))}
            </div>
            <div className="flex justify-center items-center border-t border-secondary  py-3 px-5 bg-white">
              <Link
                href={"/explore"}
                className="m-auto border rounded-full font-medium tracking-wider text-sm py-4 px-7 border-primary text-primary bg-transparent"
              >
                {tReviewCart("rentAnotherBook")}
              </Link>
            </div>
          </div>
        )}
        {purchaseItems?.length > 0 && (
          <div className="pt-7 pb-5 px-5 bg-white rounded-xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="space-x-1 font-medium flex text-secondary-foreground">
                <p className="space-x-1">
                  <span className="capitalize text-black">{t("to")}</span>
                  <span className="text-black">{t("purchase")}</span>
                </p>
                <p className="space-x-1">
                  (<span>{purchaseItems?.length}</span>
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
                {tReviewCart("purchaseMsg")}
              </p>
            </div>
            <div className="space-y-4">
              {purchaseItems.map((item) => (
                <CartItem
                  key={item.isbn}
                  item={item}
                  buttonTextTl="moveToRent"
                  itemForRent={false}
                  onMoveButtonClick={() => handleMoveToRent(item.isbn)}
                  onTrashClick={() => handleRemoveItem(item.isbn)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center  py-3 px-5 bg-white">
        {/* <Link
          href="/checkout"
          className={cn(
            buttonVariants(),
            "m-auto bg-primary rounded-full py-6 px-7 hover:text-black border-primary"
          )}
        >
          <span className="first-letter:uppercase">
            {" "}
            {tReviewCart("confirmWithdrawal")}
          </span>
        </Link> */}

        <Button
          onClick={transactionCheckout}
          className={cn(
            buttonVariants(),
            "m-auto bg-primary rounded-full py-6 px-7 hover:text-black border-primary"
          )}
        >
          <span className="first-letter:uppercase">
            {" "}
            {tReviewCart("confirmWithdrawal")}
          </span>
        </Button>
      </div>
    </section>
  );
}
