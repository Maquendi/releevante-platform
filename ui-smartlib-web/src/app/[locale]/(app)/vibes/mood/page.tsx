import { FetchFtagsBy } from "@/actions/book-actions";
import NextPrevVibesBtns from "@/components/vibes/NextPrevVibesBtns";
import VibeItemsList from "@/components/vibes/VibeItemsList";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";



const vibeIcons: Record<string, string> = {
    "lighthearted and fun": "🤣",
    "swoon-worthy": "😍",
    "suspenseful": "🕵️‍♀️",
    "magical and enchanting": "🧙‍♀️",
    "adventurous and daring": "✨",
    "cozy and nostalgic": "🐻",
    "thoughtful and inspiring": "🤩",
    "spine-tingling and eerie": "😱",
    "growing": "💰",
  };
  

export default async function MoodVidePage() {
  const t = await getTranslations("moodPage");
  const noodVibeTags = await FetchFtagsBy("mood_vibe");

  return (
    <div className="bg-white min-h-[91vh] overflow-hidden grid grid-rows-[auto_1fr]">
      <header className="px-7 flex items-center pt-3 justify-between mt-5 border-b border-gray-200 pb-10">
        <div>
          <h2 className="text-4xl font-semibold space-x-1 mb-3">
            <span>{t("currentMoodTitle1")}</span>
            <span className="text-primary">{t("currentMoodTitle2")}</span>
            <span>{t("currentMoodTitle3")}</span>
          </h2>
          <p>{t("aboutMoodSubTitle")}</p>
        </div>
        <figure>
          <Image
            src="/images/being-silly-crazy.svg"
            width={150}
            height={150}
            sizes="w-full"
            className="object-cover "
            alt="inspire others image"
          />
        </figure>
      </header>
      <section className="space-y-5 mt-5 grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <div>
          <VibesStateIndicator />
        </div>
        <div className="text-center space-y-9">
          <h3 className="text-2xl font-medium space-x-1">
            <span>{t('selectFeeling1')}</span>
            <span className="text-primary">{t('selectFeeling2')}</span>
            <span>{t('selectFeeling3')}</span>
          </h3>

          <div className="max-w-[754px] m-auto">
          <VibeItemsList icons={vibeIcons} items={noodVibeTags} vibeType="moodVibe"/>
          </div>
        </div>
        <NextPrevVibesBtns prevPage="/vibes/readingvibe" nextPage="/vibes/flavorofstory"/>

      </section>
    </div>
  );
}
