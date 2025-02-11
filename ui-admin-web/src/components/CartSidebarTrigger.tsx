"use client";
import {
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "@/config/i18n/routing";
import { useAppSelector } from "@/redux/hooks";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";


export default function CartSidebarTrigger() {
  const { setOpen, open } = useSidebar();
  const router = useRouter()
  const numItemsInCart =
    useAppSelector((store) => store.cart.items?.length) || 0;
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 770px)" });

    if(isTabletOrMobile){
      return(
        <button suppressHydrationWarning className="relative" onClick={() => router.push('/cart')}>
        <Menu/>
      </button>
      )
    }

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