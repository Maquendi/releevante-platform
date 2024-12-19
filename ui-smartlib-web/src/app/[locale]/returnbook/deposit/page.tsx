"use client";
import { useAppSelector } from "@/redux/hooks";
import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {  useMemo, useState } from "react";

export default function DepositPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const [currentIndex, setCurrentIndex] = useState(1);
  const t = useTranslations("depositPage");


  const currentBook = useMemo(() => {
    return cartItems[currentIndex];
  }, [currentIndex, cartItems]);

  return (
    <div>
      <header className="bg-white py-4 flex justify-center">
        <div>
          <Image
            src="/images/releevante.svg"
            width={250}
            height={350}
            alt={`${currentBook?.title} image`}
            className="m-auto object-cover rounded-md w-[110px] h-auto"
          />{" "}
        </div>
      </header>
      <section className="grid grid-rows-[auto_1fr_auto] space-y-2 gap-5 mt-20  text-center  ">
        <div>
          <h1 className="text-3xl font-medium">
            {t("depositBookTitle1")}{" "}
            <span className="text-primary">
              {t("depositBookTitle2")} <span>1</span>
            </span>
          </h1>
        </div>
        <div className="space-y-7 m-auto">
          <div>
            <figure className="relative  w-[230px] h-[270px] m-auto">
              <Image
                src={currentBook?.image}
                fill
                alt={`${currentBook?.title} image`}
                className=" m-auto object-cover rounded-md"
              />
              <div className="absolute -top-3 left-[50%] -translate-x-[50%] bg-white border border-primary p-1.5 rounded-full">
                <RefreshCcw size={12} />
              </div>
            </figure>
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
                <p className="text-sm">
                  {t("firstStepContent1")}
                  <span className="text-primary px-1">
                    &lt; {t("firstStepContent2")} 1&gt;
                  </span>
                  {t("firstStepContent3")}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium"> {t("nextStepTitle")}</h4>
                <p className="text-sm"> {t("nextStepContent")}</p>
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
  );
}
