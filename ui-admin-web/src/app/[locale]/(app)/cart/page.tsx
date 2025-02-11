"use client";

import { useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import useGetCartBooks from "@/hooks/useGetCartBooks";
import { useRouter } from "@/config/i18n/routing";
import { CartEmpty } from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import MaxWithWrapper from "@/components/MaxWithWrapper";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import BookItem from "@/components/catalogByCategory/BookItem";

export default function CartSidebar() {
  const settings = useAppSelector((state) => state.settings);
  const t = useTranslations("cart");
  const { rentItems, purchaseItems } = useGetCartBooks();
  const router = useRouter();
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [open, setOpen]);

  return (
    <section className="h-[92vh] grid grid-rows-[1fr_auto]">
      <div className="overflow-y-auto">
        <MaxWithWrapper className="w-full h-full py-4">
          <div className=" w-full h-full">
            {!rentItems?.length && !purchaseItems?.length && (
              <div className="bg-white rounded-xl h-full w-full grid place-content-center text-center font-semibold">
                <div>
                  <CartEmpty isPage={true} />
                  <div className="flex text-xl gap-1 justify-center">
                    <p className="space-x-1">
                      <span className="capitalize">{t("to")}</span>
                      <span className="text-black">{t("rent")} </span>
                    </p>
                    <p className="space-x-1">
                      (<span>{rentItems?.length}</span>
                      {settings?.data && (
                        <>
                          <span>{t("of")}</span>
                          <span>{settings?.data?.maxBooksPerLoan}</span>
                        </>
                      )}
                      )
                    </p>
                  </div>
                  <p className="font-light text-sm px-5">{t("emptyCart")}</p>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {rentItems?.length > 0 && (
                <div className="bg-white rounded-xl px-4 py-6">
                  <h3 className="text-base md:text-xl flex font-semibold space-x-2 mb-4">
                    <p className="space-x-1">
                      <span className="capitalize text-black">{t("to")}</span>
                      <span className="text-black">{t("rent")}</span>
                    </p>
                    <p className="space-x-1">
                      (<span>{rentItems?.length}</span>
                      {settings?.data && (
                        <>
                          <span>{t("of")}</span>
                          <span>{settings?.data?.maxBooksPerLoan}</span>
                        </>
                      )}
                      )
                    </p>
                  </h3>
                  <div className="grid gap-2 md:gap-5 justify-start grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
                    {rentItems?.map((item) => (
                      <BookItem
                        width={140}
                        height={190}
                        key={item.isbn}
                        book={item as any}
                      />
                    ))}
                  </div>
                </div>
              )}

              {purchaseItems?.length > 0 && (
                <div className="bg-white rounded-xl px-4 py-6">
                  <h3 className="flex text-nowrap text-base md:text-xl font-semibold space-x-1 mb-4">
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
                  <div className="grid gap-2 md:gap-5 justify-start grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
                    {purchaseItems.map((item) => (
                      <BookItem
                        width={140}
                        height={190}
                        key={item.isbn}
                        book={item as any}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </MaxWithWrapper>
      </div>

      <div className="bg-white py-3 flex justify-center border-t border-secondary">
        <Button
          disabled={!rentItems?.length && !purchaseItems?.length}
          onClick={() => router.push("/reviewcart")}
          className="py-7 px-8 rounded-full font-medium hover:text-black hover:bg-accent"
        >
          <span className="first-letter:uppercase">{t("checkout")}</span>
        </Button>
      </div>
    </section>
  );
}

