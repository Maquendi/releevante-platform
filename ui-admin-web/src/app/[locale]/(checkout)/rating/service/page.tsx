"use client";

import MaxWithWrapper from "@/components/MaxWithWrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useSaveBookReview from "@/hooks/useSaveServiceReview";
import { cn } from "@/lib/utils";
import { LoaderCircle, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export default function RatingPage() {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const stars = [1, 2, 3, 4, 5];
  const t = useTranslations("serviceRatingPage");
  const { mutate: saveBookReviewMutation, isPending } = useSaveBookReview();

  return (
    <MaxWithWrapper className="pb-5">
      <div className="bg-white pt-3 px-4 md:px-6 pb-6 rounded-xl mt-5 relative max-w-[850px] m-auto">
        <section className=" space-y-6 relative z-10 mt-5">
          <figure>
            <Image
              src="/images/rating.svg"
              width={150}
              height={300}
              className="w-[270px] h-auto m-auto"
              alt="relevante name image"
            />
          </figure>
          <div className="text-center space-y-5">
            <h1 className="text-2xl md:text-4xl font-medium">{t("title")}</h1>
            <p className="font-light">{t("subTitle")}</p>
          </div>
          <div
            className={cn(
              "bg-background rounded-xl py-5 px-5 flex flex-col items-center  space-y-2 "
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
                        : "fill-[#B3B1B1]",
                      rating >= star ? "animate-pulse" : null
                    )}
                    size={40}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 font-[400]">
            <p className="font-medium">
              {t("commentTitle")}
              <span className="font-light pl-1">({t("optional")})</span>
            </p>
            <Textarea
              className="z-10 relative min-h-[100px]"
              placeholder={t("commentPlaceHolder")}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            ></Textarea>
          </div>
          <div className="flex justify-center ">
            <Button
              disabled={!rating || isPending}
              onClick={() => saveBookReviewMutation({ rating, comment })}
              className="rounded-full px-5 py-6 hover:text-primary"
            >
              {t("submit")}
              {isPending && <LoaderCircle size={15} className="animate-spin"/>}
            </Button>
          </div>
        </section>
      </div>
    </MaxWithWrapper>
  );
}
