import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { CartItemState } from "@/redux/features/cartSlice";
import { Locales } from "@/types/globals";
import { useLocale } from "next-intl";
import Image from "next/image";
import { CartItemOptions } from "./CartItemOptions";
interface CartItemProps {
  item: CartItemState;
  buttonTextTl: any;
  itemType: "PURCHASE" | "RENT";
}


export const CartItem = ({ item, buttonTextTl, itemType }: CartItemProps) => {
    const locale = useLocale();
  
    const { isPurchaseDisable,isRentingDisable } =
      useAddBookToCart(item as any);
  
      const moveButtonDisabled = itemType === "RENT" ? isRentingDisable : isPurchaseDisable;
  
  
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