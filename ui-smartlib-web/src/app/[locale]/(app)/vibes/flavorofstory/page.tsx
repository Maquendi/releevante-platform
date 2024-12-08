import { FetchFtagsBy } from "@/actions/book-actions";
import NextPrevVibesBtns from "@/components/vibes/NextPrevVibesBtns";
import VibeItemsList from "@/components/vibes/VibeItemsList";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

const flavorOfStoryIcons: Record<string, string> = {
  "Sci-fi: To the stars and beyond": "🌌",
  "Fantasy: Dragon, magi, etc": "🏰",
  "Mystery/Thriller: Who did it? Need answers": "🕵️‍♀️",
  "Romance: Sparks flying!": "❤️",
  "Drama: Deep emotions, please": "🎭",
  "Historical fiction: Step back in time": "📜",
  "Non-fiction: Real stories, real facts, money": "💰",
  "Surprise me": "🤔",
};

export default async function MoodVidePage() {
  const t = await getTranslations("flavorOfStoryPage");
  const flavorOfStoryVibeTags = await FetchFtagsBy("flavor_story_vibe");

  return (
    <div className="bg-white min-h-[91vh] overflow-hidden grid grid-rows-[auto_1fr]">
      <header className="px-7 flex items-center pt-3 justify-between mt-5 border-b border-gray-200 pb-10">
        <div>
          <h2 className="text-4xl font-semibold space-x-1 mb-3">
            <span>{t("favoriteFlavorTitle1")}</span>
            <br />
            <span className="text-primary">{t("favoriteFlavorTitle2")}</span>
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

          <div className="max-w-[754px] m-auto">
            <VibeItemsList
              icons={flavorOfStoryIcons}
              items={flavorOfStoryVibeTags}
              vibeType="favorStoryVibe"
            />
          </div>
        </div>
        <div>
          <NextPrevVibesBtns
            prevPage="/vibes/mood"
            nextPage="/vibes/recomendation"
          />
        </div>
      </section>
    </div>
  );
}
