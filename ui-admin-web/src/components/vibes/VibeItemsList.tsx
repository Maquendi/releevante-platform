"use client";
import { useRouter } from "@/config/i18n/routing";
import useVibeTags from "@/hooks/useVibeTags";
import { cn } from "@/lib/utils";
import { VibeType } from "@/types/book";
import { Locales } from "@/types/globals";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type VibePages = 'flavorofstory' | 'mood' |'readingvibe' | 'recomendation'

interface VibeItemsListProps {
  vibeType: VibeType;
  nextPage:VibePages
}



export default function VibeItemsList({
  vibeType,
  nextPage
}: VibeItemsListProps) {
  const locale = useLocale();
  const {getTagsByType}=useVibeTags()
  const searchParams= useSearchParams()
  const router = useRouter()

  const items = useMemo(()=>{
    return getTagsByType(vibeType)
  },[vibeType,getTagsByType])

  return (
    <div className="flex flex-wrap justify-center gap-5 first-letter:uppercase">
      {items.map((tag) => {
        return (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.set(vibeType,tag.id)
              router.push(`/vibes/${nextPage}?${params.toString()}`)
            }}
            key={tag.id}
            className={cn(
              " space-x-2 py-3 px-6 rounded-full w-full md:w-fit border border-gray-300",
               
            )}
          >
            <span>
              {tag?.value?.[locale as Locales]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
