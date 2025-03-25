"use client";
import {
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@/config/i18n/routing";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";

function CartIndicator(){
  const numItemsInCart =
  useAppSelector((store) => store.cart.items?.length) || 0;
  return (
    <div>
        <Image
        src="/icons/cart.svg"
        className="w-[40px] h-[40px]"
        width={40}
        height={40}
        alt="cart icon"
      />
      {numItemsInCart > 0 && (
        <span suppressHydrationWarning className="grid place-content-center pt-[0.100rem] absolute -top-2 -right-2.5 font-medium text-xs text-white w-6 h-6 rounded-full  bg-[#FF2D55]">
          {numItemsInCart}
        </span>
      )}
    </div>
  )
}

 export function CartSidebarTrigger() {
  const { setOpen, open } = useSidebar();
  return (
    <button suppressHydrationWarning className="relative" onClick={() => setOpen(!open)}>
     <CartIndicator/>
    </button>
  );
}

 export function CartTrigger() {
  return (
    <Link href="/cart" suppressHydrationWarning className="relative">
      <CartIndicator/>
    </Link>
  );
}