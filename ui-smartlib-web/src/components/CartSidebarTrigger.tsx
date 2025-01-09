"use client";
import {
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";


export default function CartSidebarTrigger() {
  const { setOpen, open } = useSidebar();
  const numItemsInCart =
    useAppSelector((store) => store.cart.items?.length) || 0;

  return (
    <button suppressHydrationWarning className="relative" onClick={() => setOpen(!open)}>
      <Image
        src="/icons/cart.svg"
        className="w-[30px] h-[30px]"
        width={40}
        height={40}
        alt="cart icon"
      />
      {numItemsInCart > 0 && (
        <span suppressHydrationWarning className="grid place-content-center pt-[0.100rem] absolute -top-3 -right-2.5 font-medium text-xs text-white w-6 h-6 rounded-full  bg-[#FF2D55]">
          {numItemsInCart}
        </span>
      )}
    </button>
  );
}