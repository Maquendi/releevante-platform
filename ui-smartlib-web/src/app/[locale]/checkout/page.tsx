"use client";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { CircleCheck, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "@/config/i18n/routing";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearBookExchangeState } from "@/redux/features/bookExchangeSlice";

export default function CheckoutPage() {
  const t = useTranslations("checkout");

  const router = useRouter();

  const dispatch = useDispatch();

  const { transactionItems, currentItem, bookExchangeSuccess } = useAppSelector(
    (state) => state.bookExchange
  );

  useEffect(() => {
    if (bookExchangeSuccess) {
      setTimeout(() => {
        router.push("/");
        dispatch(clearBookExchangeState());
      }, 3000);
    }
  }, [currentItem, transactionItems, bookExchangeSuccess]);

  return (
    <div className=" overflow-hidden">
      <header className="bg-white py-5 flex justify-center">
        <p className="text-base font-medium ml-[190px]">
          {t("readInstructions")}
        </p>
      </header>
      <div className="grid grid-cols-[auto_1fr] h-full">
        <aside className="bg-white space-y-7 w-[200px] pt-5 h-full ">
          <div>
            <h3 className="text-2xl pl-3 font-semibold">{t("yourBooks")}</h3>
          </div>
          <div className="">
            {transactionItems.map((item, index) => {
              return (
                <article
                  key={item.isbn}
                  className={cn(
                    "py-4 px-3 flex justify-between items-center",
                    item.currentlyExchanging &&
                      "border-r-[5px]  border-primary bg-accent"
                  )}
                >
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        !item.exchangeCompleted && "text-gray-500",
                        item.currentlyExchanging && "text-primary"
                      )}
                    >
                      {index + 1}. {item.title}
                    </p>
                  </div>

                  <div>
                    {item.exchangeCompleted && (
                      <CircleCheck className="fill-black  text-white" />
                    )}
                    {item.currentlyExchanging && !item.exchangeCompleted && (
                      <RefreshCcw
                        size={20}
                        className="animate-spin  text-black"
                      />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </aside>
        <section className="grid grid-rows-[1fr_auto place-content-center gap-12 mt-10  text-center">
          <div className="space-y-5">
            <div>
              <h2 className="text-3xl font-medium">{t("pickYourBook")}</h2>
            </div>
            <div>
              <figure>
                <Image
                  src={currentItem?.image || ""}
                  width={250}
                  height={350}
                  alt={`${currentItem?.title} image`}
                  className="m-auto object-cover rounded-md w-[210px] h-[270px]"
                />
              </figure>
            </div>
            <div>
              <h3 className="text-4xl font-medium">
                {t("openingDoor1")}{" "}
                <span className="text-primary ">{t("openingDoor2")}</span>{" "}
                <span className="text-primary">({currentItem?.position})</span>
              </h3>
            </div>
            <div className="text-left flex gap-3 bg-white p-5 rounded-2xl max-w-[500px]">
              <Image
                src="/images/door-checkout.svg"
                width={250}
                height={350}
                className="w-[160px] h-[170px] object-top object-cover runded-md"
                alt="door checkout image"
              />
              <div className="space-y-5">
                <div className="space-y-2">
                  <h4 className="font-medium">{t("firstStepTitle")}</h4>
                  <p>
                    {t("firstStepContent1")}
                    <span className="text-primary">
                      {" "}
                      {t("firstStepContent2")}
                      {currentItem?.position}
                    </span>{" "}
                    {t("firstStepContent3")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium"> {t("nextStepTitle")}</h4>
                  <p> {t("nextStepContent")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-2">
            <p className="font-medium space-x-1">
              <span> {t("closeDoorTime1")}</span> <span>1</span>
              <span>{t("closeDoorTime2")}</span> 3
              <span>{t("closeDoorTime3")}</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
