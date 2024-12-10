"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import useGetBooks from "@/hooks/useGetBooks";
import { useRouter } from "@/config/i18n/routing";

export function CartSidebarTrigger() {
  const { setOpen, open } = useSidebar();

  return (
    <button onClick={() => setOpen(!open)}>
      <Image
        src="/icons/cart.svg"
        className="w-[30px] h-[30px]"
        width={40}
        height={40}
        alt="cart icon"
      />
    </button>
  );
}

export function CartEmpty() {
  const t = useTranslations("cart");

  return (
    <div className="px-4  text-center">
      <figure>
        <Image
          src="/images/searching.svg"
          className="w-[90px] h-100px] object-contain m-auto"
          width={100}
          height={100}
          alt="cart icon"
        />
      </figure>
      <p className="font-light text-sm px-5">{t("emptyCart")}</p>
    </div>
  );
}

export function CartSidebar() {
  const settings = useAppSelector((state) => state.settings);
  const { open } = useSidebar();
  const t = useTranslations("cart");
  const {rentItems,purchaseItems}=useGetBooks()
  const router = useRouter()
 
  return (
    <div className="relative">
      {open && (
        <div className="absolute top-[1.4rem] rotate-45 z-[999] -left-[0.55rem] w-[20px] h-[20px] border-b border-l border-black bg-white"></div>
      )}
      <Sidebar side="right">
        <SidebarContent className="relative grid grid-rows-[auto_1fr_auto] bg-whitem overflow-hidden bg-white border-l border-black">
          <h2 className="font-semibold text-xl text-center mt-4 mb-6 capitalize">
            {t("cart")}
          </h2>
          {!rentItems?.length && !purchaseItems?.length && (
            <div className="text-center font-semibold">
              <div className="flex gap-1 justify-center">
                <p className="space-x-1">
                  <span className=" capitalize">{t("to")}</span>
                  <span className="text-black">{t("rent")} </span>
                </p>
                <p className="space-x-1">
                  (<span>{rentItems.length}</span>
                  {settings?.data && (
                    <>
                      <span>{t("of")}</span>
                      <span>{settings?.data?.maxBooksPerLoan}</span>
                    </>
                  )}
                  )
                </p>
              </div>
              <CartEmpty />
            </div>
          )}
          <div className=" overflow-y-auto space-y-3 overflow-hidden">
            {rentItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="m-auto text-base font-semibold space-x-2 mb-4">
                  <p className="space-x-1">
                    <span className="capitalize text-black">{t("to")}</span>
                    <span className="text-black">{t("rent")}</span>
                  </p>
                  <p className="space-x-1">
                    (<span>{rentItems.length}</span>
                    {settings?.data && (
                      <>
                        <span>{t("of")}</span>
                        <span>{settings?.data?.maxBooksPerLoan}</span>
                      </>
                    )}
                    )
                  </p>
                </SidebarGroupLabel>
                <SidebarGroupContent className="border-b border-gray-500 pb-5">
                  <div className="space-y-2">
                    {rentItems.map((item) => (
                      <article
                        key={item?.isbn}
                        className="relative px-[1.2rem]"
                      >
                        <Image
                          width={300}
                          height={300}
                          src={item.image}
                          alt="book item in cart"
                          className="w-full h-[200px] rounded-md object-cover"
                        />
                      </article>
                    ))}
                  </div>
                  <SidebarMenu></SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {purchaseItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="m-auto text-nowrap text-base font-semibold space-x-1 mb-4 px-[1.2rem]">
                  <p className="space-x-1">
                    <span className="capitalize text-black">{t("to")}</span>
                    <span className="text-black">{t("purchase")}</span>
                  </p>
                  <p className="space-x-1">
                    (<span>{purchaseItems.length}</span>
                    {settings?.data && (
                      <>
                        <span>{t("of")}</span>
                        <span>{settings?.data?.maxBooksPerLoan}</span>
                      </>
                    )}
                    )
                  </p>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-2">
                    {purchaseItems.map((item) => (
                      <article key={item.isbn} className="relative px-4">
                        <Image
                          width={300}
                          height={300}
                          src={item.image}
                          alt="book item in cart"
                          className="w-full h-[200px] rounded-md object-cover"
                        />
                      </article>
                    ))}
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </div>

          <div className=" bg-white py-3 flex justify-center border-t border-secondary">
            <Button
              disabled={!rentItems?.length && !purchaseItems?.length}
              onClick={()=>router.push('/checkout')}
              className=" py-7 px-8 rounded-full font-medium hover:text-black hover:bg-accent  "
            >
              <span className=" first-letter:uppercase"> {t("checkout")}</span>
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
