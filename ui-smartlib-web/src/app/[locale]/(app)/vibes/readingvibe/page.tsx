import { FetchFtagsBy } from "@/actions/book-actions";
import NextPrevVibesBtns from "@/components/vibes/NextPrevVibesBtns";
import VibeItemsList from "@/components/vibes/VibeItemsList";
import VibesStateIndicator from "@/components/vibes/VibesStateIndicator";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { split } from "postcss/lib/list";

// Definir los íconos correspondientes a cada tag
const tagIcons: Record<string, string> = {
  "to be entertained": "🌟", 
  "Something relaxing": "🧘‍♀️", 
  "an adventure": "🚀", 
  " something new": "🧠", 
  " here for feels": "❤️", 
  " love a good mystery ": "🔍"
};



export default async function ReadingVidePage() {
  const t = await getTranslations("readingVibePage");
  const readingVibeTags = await FetchFtagsBy("reading_vibe");

  return (
    <div className="bg-white min-h-[91vh] overflow-hidden grid grid-rows-[auto_1fr]">
      <header className="px-7 flex items-center pt-3 justify-between mt-5 border-b border-gray-200 pb-10">
        <div>
          <h2 className="text-4xl font-semibold space-x-1 mb-3">
            <span>{t("readingVibe1")}</span>
            <span className="text-primary">{t("readingVibe2")}</span>
            <span>?</span>
          </h2>
          <p>{t("reasonForReading")}</p>
        </div>
        <figure>
          <Image
            src="/images/inspire-others.svg"
            width={150}
            height={150}
            sizes="w-full"
            className="object-cover mr-10"
            alt="inspire others image"
          />
        </figure>
      </header>
      <section className="space-y-5 mt-5 grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <div>
          <VibesStateIndicator />
        </div>
        <div className="text-center space-y-9 h-full">
          <h3 className="text-2xl font-medium space-x-1">
            <span>{t('selectPurpose1')}</span>
            <span className="text-primary">{t('selectPurpose2')}</span>
            <span>{t('selectPurpose3')}</span>
          </h3>

          <div className="max-w-[754px]  m-auto">
          <VibeItemsList icons={tagIcons} items={readingVibeTags} vibeType="readingVibe"/>
          </div>
        </div>
        <NextPrevVibesBtns nextPage="/vibes/mood"/>

      </section>
    </div>
  );
}
