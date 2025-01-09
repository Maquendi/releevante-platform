"use client";
import { FtagItem } from "@/book/domain/models";
import { cn } from "@/lib/utils";
import { updateVibe, VibeState } from "@/redux/features/vibeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLocale } from "next-intl";

interface VibeItemsListProps {
  icons: Record<string, string>;
  items: FtagItem[];
  vibeType: keyof VibeState;
}

function filterTextByKeword(text: string, testText: string) {
  return new RegExp(text, "i").test(testText);
}

export default function VibeItemsList({
  icons,
  items,
  vibeType,
}: VibeItemsListProps) {
  const dispath = useAppDispatch();
  const selectedReadingVideId = useAppSelector((state) => state.vide[vibeType]);
  const locale = useLocale();

  return (
    <div className="flex flex-wrap justify-center gap-5 first-letter:uppercase">
      {items.map((tag) => {
        const tagValue = tag?.enTagValue;

        const matchingText = Object.keys(icons).find((keyword) =>
          filterTextByKeword(keyword, tagValue)
        );

        const icon = matchingText ? icons[matchingText] : null;

        return (
          <button
            onClick={() => dispath(updateVibe({ vibeType, value: tag.id }))}
            key={tag.id}
            className={cn(
              " space-x-2 py-3 px-6 rounded-full border border-gray-300",
              selectedReadingVideId === tag.id && "border-primary bg-accent"
            )}
          >
            <span>{icon}</span>
            <span>
              {tag?.[`${locale}TagValue`]?.charAt(0).toUpperCase() +
                tag?.[`${locale}TagValue`]?.slice(1)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
