import { FetchVibeTags } from "@/actions/book-actions";
import { getQueryClient } from "@/app/getQueryClient";
import MaxWithWrapper from "@/components/MaxWithWrapper";
import VibeItemsList from "@/components/vibes/VibeItemsList";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function MoodVidePage() {
  const t = await getTranslations("flavorOfStoryPage");
  const queryClient = getQueryClient();
  await queryClient.ensureQueryData({
    queryKey: ["VIBE_TAGS"],
    queryFn: async () => await FetchVibeTags(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="bg-white min-h-[91vh] overflow-hidden grid grid-rows-[auto_1fr] pb-4">
        <MaxWithWrapper className="border-b min-h-fit border-gray-200  w-full">
          <header className=" flex flex-col-reverse  text-center md:text-left md:flex-row  items-center pt-3 justify-between gap-10 mt-5 pb-10">
            <div className="flex-grow">
              <h2 className="text-3xl  md:text-4xl font-semibold space-x-3 mb-3  ">
                <span>{t("favoriteFlavorTitle1")}</span>
                <span className="text-primary">
                  {t("favoriteFlavorTitle2")}
                </span>
                <span>?</span>
              </h2>
              <p>{t("narrowDownSubTitle")}</p>
            </div>
            <figure>
              <Image
                src="/images/listening-music.svg"
                width={150}
                height={150}
                sizes="w-full"
                className="object-cover "
                alt="inspire others image"
              />
            </figure>
          </header>
        </MaxWithWrapper>
        <MaxWithWrapper>
          <section className="space-y-5 mt-5 grid grid-rows-[auto_1fr_auto] overflow-hidden">
            <div>
              <VibesStateIndicator />
            </div>
            <div className="text-center space-y-9">
              <h3 className="text-2xl font-medium space-x-1">
                <span>{t("selectGenres1")}</span>
                <span className="text-primary">{t("selectGenres2")}</span>
                <span>{t("selectGenres3")}</span>
              </h3>

              <div className="md:max-w-[754px] m-auto">
                <VibeItemsList vibeType="flavor" nextPage='recomendation' />
              </div>
            </div>
         
          </section>
        </MaxWithWrapper>
      </div>
    </HydrationBoundary>
  );
}
