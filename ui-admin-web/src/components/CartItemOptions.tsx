'use client'
import { CartItemState, removeItem, updateItem } from "@/redux/features/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
  
interface CartItemOptionsProps {
    item: CartItemState;
    itemType: "PURCHASE" | "RENT";
    moveButtonDisabled: any;
    buttonTextTl: any;
  }
  
  export const CartItemOptions = ({
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
  