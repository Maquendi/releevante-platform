"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useRouter } from "@/config/i18n/routing";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import useGetBooks from "@/hooks/useGetCartBooks";
import { cn, formatDateByRegion } from "@/lib/utils";
import {
  CartItemState,
  removeItem,
  updateItem,
} from "@/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Locales } from "@/types/globals";
import { EllipsisVertical, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "react-responsive";
import NavbarV2 from "@/components/NavbarV2";

interface CartItemProps {
  item: CartItemState;
  buttonTextTl: any;
  itemType: "PURCHASE" | "RENT";
}

interface CartItemOptionsProps {
  item: CartItemState;
  itemType: "PURCHASE" | "RENT";
  moveButtonDisabled: any;
  buttonTextTl: any;
}

const CartItemOptions = ({
  moveButtonDisabled,
  item,
  itemType,
}: CartItemOptionsProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const t = useTranslations("reviewMyCart");
  const dispatch = useAppDispatch();
  const transactionType = itemType === "RENT" ? "PURCHASE" : "RENT";
  const btnTypeIntl = itemType === "RENT" ? "moveToBuy" : "moveToReadInHotel";

  const handleMoveBook = (isbn: string) => {
    dispatch(updateItem({ isbn, transactionType }));
  };

  const handleRemoveItem = (isbn: string) => {
    dispatch(removeItem({ isbn }));
  };

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2 mt-1">
          <DropdownMenuItem>
            <button
              disabled={moveButtonDisabled}
              onClick={() => handleMoveBook(item.isbn)}
            >
              {t(btnTypeIntl)}
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={() => handleRemoveItem(item.isbn)}>
              {t("delete")}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        disabled={moveButtonDisabled}
        onClick={() => handleMoveBook(item.isbn)}
        className="bg-accent text-primary rounded-full px-6 py-6 shadow-sm"
      >
        {t(btnTypeIntl)}
      </Button>
      <button onClick={() => handleRemoveItem(item.isbn)}>
        <Image
          width={40}
          height={40}
          src="/icons/trash.svg"
          alt="Remove book from cart"
          className="w-[30px] h-[30px] rounded-md object-cover"
        />
      </button>
    </div>
  );
};

const CartItem = ({ item, buttonTextTl, itemType }: CartItemProps) => {
  const locale = useLocale();

  const { isPurchaseDisable,isRentingDisable } =
    useAddBookToCart(item as any);

  const moveButtonDisabled = (() => {
    if (itemType === "RENT") {
      return isRentingDisable
    }
    return isPurchaseDisable
  })();

  return (
    <article key={item?.isbn} className="relative flex justify-between gap-3">
      <div className="grid grid-cols-[auto_1fr] gap-2 md:gap-5 items-center">
        <figure>
          <Image
            width={300}
            height={200}
            src={item?.image || ""}
            alt="book item in cart"
            className="w-[80px] h-[105px] md:w-[110px] md:h-[135px] rounded-md object-cover"
          />
        </figure>
        <div className="space-y-1  overflow-x-hidden">
          <div className="flex  gap-1 mb-1">
            {item.categories?.map((category) => (
              <p
                key={category.en}
                className="text-xs bg-primary text-nowrap px-2 py-1 rounded-sm font-medium text-white w-fit"
              >
                {category?.[`${locale}` as Locales]}
              </p>
            ))}
          </div>
          <h4 className="text-base md:text-2xl text-wrap font-medium">
            {item.title}
          </h4>
          <p className="text-secondary-foreground font-light tracking-wide">
            {item.author}
          </p>
        </div>
      </div>
      <div className="my-auto">
        <CartItemOptions
          buttonTextTl={buttonTextTl}
          moveButtonDisabled={moveButtonDisabled}
          item={item}
          itemType={itemType}
        />
      </div>
    </article>
  );
};

export default function ReviewCartPage() {
  const { rentItems, purchaseItems } = useGetBooks();
  const settings = useAppSelector((state) => state.settings);
  const t = useTranslations("reviewMyCart");
  const locale = useLocale();
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
        {rentItems?.length > 0 && (
          <div className="pt-7 grid bg-white rounded-xl space-y-5">
            <div className="px-4 space-y-1 md:flex justify-between">
              <h3 className="space-x-1 text-xl font-medium flex">
                <p className="space-x-1">
                  <span className="text-black">{t("readInHotel")} </span>
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
              <h3 className="space-x-1 first-letter:uppercase text-gray-500 text-sm md:text-base">
                <span>{t("returnDate")}:</span>
                <span>{formatDateByRegion(new Date(), locale as any)}</span>
              </h3>
            </div>
            <div className="px-4 space-y-4">
              {rentItems.map((item) => (
                <CartItem
                  key={item.isbn}
                  item={item}
                  buttonTextTl="moveToBuy"
                  itemType="RENT"
                />
              ))}
            </div>
            <div className="flex justify-center items-center border-t border-secondary  py-3 px-5 bg-white">
              <Link
                href={"/catalog"}
                className="m-auto border rounded-full font-medium tracking-wider text-sm py-4 px-7 border-primary text-primary bg-transparent"
              >
                {t("rentAnotherBook")}
              </Link>
            </div>
          </div>
        )}
        {purchaseItems?.length > 0 && (
          <div className="pt-7 pb-5 px-5 bg-white rounded-xl space-y-5">
            <div className="md:flex space-y-1 justify-between items-center">
              <h3 className="space-x-1 text-xl font-medium flex text-secondary-foreground">
                <p className="space-x-1">
                  <span className="text-black">{t("toBuy")}</span>
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
                {t("purchaseMsg")}
              </p>
            </div>
            <div className="space-y-4">
              {purchaseItems.map((item) => (
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
      <div className="flex justify-center items-center h-[80px]  bottom-0 right-0 left-0  py-1 px-5 bg-white">
        <Link
          href="/checkout"
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
