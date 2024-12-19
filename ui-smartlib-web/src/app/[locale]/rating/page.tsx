"use client";

import SelectLanguage from "@/components/SelectLanguage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export default function RatingPage() {
  const [rating, setRating] = useState(0);
  const stars = [1, 2, 3, 4, 5]; 

  const t = useTranslations("ratingPage");
  return (
    <div className="bg-white min-h-screen relative">
      <nav className="flex justify-between px-5 py-3">
        <SelectLanguage />
        <Image
          src="/images/releevante.svg"
          width={150}
          height={300}
          className="w-[110px]"
          alt="relevante name image"
        />
      </nav>
      <section className="px-20 space-y-7 relative z-10 mt-5">
        <figure>
          <Image
            src="/images/rating.svg"
            width={150}
            height={300}
            className="w-[130px] h-auto m-auto"
            alt="relevante name image"
          />
        </figure>
        <div className="text-center space-y-5">
          <h1 className="text-4xl font-medium">
           {t('title')}
          </h1>
          <p className="font-light">
            {t("subTitle")}
          </p>
        </div>
        <div
          className={cn(
            "bg-background rounded-xl py-10 px-5 flex flex-col items-center space-y-2 border",
            rating > 0 && "border-primary"
          )}
        >
          <p className="font-medium">{t("feelUsingApp")}</p>
          <div className="space-x-2">
            {stars.map((star) => (
              <button
                key={star}
                className="text-3x"
                onClick={() => setRating(star)}
              >
                <Star
                  color="none"
                  className={cn(
                    star <= rating
                      ? "fill-primary border-primary"
                      : "fill-gray-200"
                  )}
                  size={60}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2 font-[400]">
          <p>
            {t("commentTitle")}
            <span className="font-light pl-1">({t('optional')})</span>
          </p>
          <Textarea
            className="z-10 relative min-h-[120px]"
            placeholder={t('commentPlaceHolder')}
          ></Textarea>
        </div>
      
        <div className="flex justify-center pt-2">
          <Button className="rounded-full px-5 py-6 hover:text-primary">{t("submit")}</Button>
        </div>
        <div className="pb-2 text-center pt-5">
          <p className="font-medium space-x-1">
            <span> {t("closeSessionTime1")}</span>
            <span>{t("closeSessionTime2")}</span> 3
            <span>{t("closeSessionTime3")}</span>
          </p>{" "}
        </div>
      </section>
      <div className="fixed -bottom-12 left-0 right-0 z-0">
          <figure className="relative w-[700px] h-[500px]">
            <Image
              src="/images/releevante-initial.svg"
              fill
              alt="reading a book image"
              className="opacity-75"
            />
          </figure>
        </div>
    </div>
  );
}
