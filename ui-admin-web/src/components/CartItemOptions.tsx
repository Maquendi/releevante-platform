"use client";
import {
  CartItemState,
} from "@/redux/features/cartSlice";
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
import { ReservedItemType } from "@/types/book";

interface CartItemOptionsProps {
  item: CartItemState;
  itemType: ReservedItemType;
  moveItem: (id: string, type: ReservedItemType) => void;
  removeItem: (id: string) => void;
}

export const CartItemOptions = ({
  item,
  itemType,
  moveItem,
  removeItem,
}: CartItemOptionsProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const t = useTranslations("reviewMyCart");
  const btnTypeIntl = itemType === "RENT" ? "moveToBuy" : "moveToReadInHotel";

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2 mt-1">
          <DropdownMenuItem>
            <button onClick={() => moveItem(item.id!, itemType)}>
              {t(btnTypeIntl)}
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={() => removeItem(item.id!)}>{t("delete")}</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => moveItem(item.id!, itemType)}
        className="bg-accent text-primary rounded-full px-6 py-6 shadow-sm"
      >
        {t(btnTypeIntl)}
      </Button>
      <button onClick={() => removeItem(item.id!)}>
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
